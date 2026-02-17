import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoutePlanRepository } from './repositories/route-plan.repository';
import { CargoPlacementRepository } from './repositories/cargo-placement.repository';
import { CreateRoutePlanDto } from './dto/create-route-plan.dto';
import { UpdateRoutePlanDto } from './dto/update-route-plan.dto';
import { RoutePlan } from './entities/route-plan.entity';
import { RouteStop } from './entities/route-stop.entity';
import { RouteSimulation } from './entities/route-simulation.entity';
import { RouteStatus, StopType } from '../../common/enums';

@Injectable()
export class RouteService {
  constructor(
    private readonly routeRepo: RoutePlanRepository,
    private readonly cargoRepo: CargoPlacementRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateRoutePlanDto): Promise<RoutePlan> {
    const route = this.routeRepo.create({
      ...dto,
      stops: dto.stops || [],
    });
    const saved = await this.routeRepo.save(route);
    return (await this.routeRepo.findWithStops(saved.id))!;
  }

  async findOne(id: string): Promise<RoutePlan> {
    const route = await this.routeRepo.findWithStops(id);
    if (!route) throw new NotFoundException(`Route ${id} not found`);
    return route;
  }

  async findByVan(vanId: string): Promise<RoutePlan[]> {
    return this.routeRepo.findActiveByVan(vanId);
  }

  async update(id: string, dto: UpdateRoutePlanDto): Promise<RoutePlan> {
    await this.findOne(id);
    await this.routeRepo.update(id, dto as any);
    return this.findOne(id);
  }

  /**
   * SIMULATION ALGORITHM:
   *
   * 1. Deep-clone the source route's stops into a new RoutePlan (status=SIMULATION)
   * 2. Create a RouteSimulation record linking source -> simulated
   * 3. Return the simulation route for modification
   * 4. Client modifies stops (add/remove/reorder)
   * 5. Client calls computeSimulationDeltas() to get impact metrics
   * 6. Client calls applySimulation() to replace active route, or discards
   */
  async createSimulation(sourceRouteId: string, name?: string): Promise<RouteSimulation> {
    const source = await this.findOne(sourceRouteId);

    return this.dataSource.transaction(async (manager) => {
      // Clone route
      const simRoute = manager.create(RoutePlan, {
        name: name || `Simulation of ${source.name || sourceRouteId}`,
        status: RouteStatus.SIMULATION,
        vanId: source.vanId,
        departureDate: source.departureDate,
        totalDistanceKm: source.totalDistanceKm,
        totalTimeMinutes: source.totalTimeMinutes,
        estimatedFuelLiters: source.estimatedFuelLiters,
        totalRevenue: source.totalRevenue,
        estimatedMargin: source.estimatedMargin,
      });
      const savedSimRoute = await manager.save(RoutePlan, simRoute);

      // Clone stops
      for (const stop of source.stops) {
        const clonedStop = manager.create(RouteStop, {
          routePlanId: savedSimRoute.id,
          loadId: stop.loadId,
          stopType: stop.stopType,
          status: stop.status,
          orderIndex: stop.orderIndex,
          groupId: stop.groupId,
          address: stop.address,
          city: stop.city,
          postcode: stop.postcode,
          country: stop.country,
          lat: stop.lat,
          lng: stop.lng,
          eta: stop.eta,
          etd: stop.etd,
          timeWindowFrom: stop.timeWindowFrom,
          timeWindowTo: stop.timeWindowTo,
          timeWindowViolation: stop.timeWindowViolation,
          distanceToNextKm: stop.distanceToNextKm,
          drivingTimeToNextMinutes: stop.drivingTimeToNextMinutes,
          pallets: stop.pallets,
          weightKg: stop.weightKg,
          notes: stop.notes,
        });
        await manager.save(RouteStop, clonedStop);
      }

      // Create simulation record
      const simulation = manager.create(RouteSimulation, {
        sourceRouteId: source.id,
        simulatedRouteId: savedSimRoute.id,
        name: name || null,
      });
      return manager.save(RouteSimulation, simulation);
    });
  }

  async applySimulation(simulationId: string): Promise<RoutePlan> {
    const simRepo = this.dataSource.getRepository(RouteSimulation);
    const simulation = await simRepo.findOne({ where: { id: simulationId } });
    if (!simulation) throw new NotFoundException(`Simulation ${simulationId} not found`);
    if (simulation.isApplied) throw new Error('Simulation already applied');

    return this.dataSource.transaction(async (manager) => {
      // Archive the old active route
      await manager.update(RoutePlan, simulation.sourceRouteId, {
        status: RouteStatus.ARCHIVED,
      });

      // Promote simulation to active
      await manager.update(RoutePlan, simulation.simulatedRouteId, {
        status: RouteStatus.ACTIVE,
      });

      // Mark simulation as applied
      await manager.update(RouteSimulation, simulationId, {
        isApplied: true,
        appliedAt: new Date(),
      });

      return (await this.routeRepo.findWithStops(simulation.simulatedRouteId))!;
    });
  }

  /**
   * CARGO TIMELINE REPLAY LOGIC:
   *
   * Given a route and a target stop index, compute what cargo is on board:
   *
   * 1. Get all route stops sorted by orderIndex ASC
   * 2. Initialize empty cargo set
   * 3. For each stop from index 0 to targetIndex:
   *    - If stop.stopType === PICKUP -> add stop.loadId to cargo set
   *    - If stop.stopType === DELIVERY -> remove stop.loadId from cargo set
   * 4. Return cargo set (list of loadIds currently on board)
   *
   * This provides the canonical cargo state at any point without static copies.
   */
  async getCargoAtStop(routeId: string, targetStopIndex: number): Promise<string[]> {
    const route = await this.findOne(routeId);
    const cargoOnBoard = new Set<string>();

    for (const stop of route.stops) {
      if (stop.orderIndex > targetStopIndex) break;

      if (stop.stopType === StopType.PICKUP) {
        cargoOnBoard.add(stop.loadId);
      } else if (stop.stopType === StopType.DELIVERY) {
        cargoOnBoard.delete(stop.loadId);
      }
    }

    return Array.from(cargoOnBoard);
  }

  async remove(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routeRepo.remove(route);
  }
}
