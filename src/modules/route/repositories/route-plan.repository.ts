import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoutePlan } from '../entities/route-plan.entity';
import { RouteStatus } from '../../../common/enums';

@Injectable()
export class RoutePlanRepository extends Repository<RoutePlan> {
  constructor(private dataSource: DataSource) {
    super(RoutePlan, dataSource.createEntityManager());
  }

  async findWithStops(id: string): Promise<RoutePlan | null> {
    return this.findOne({
      where: { id },
      relations: ['stops', 'stops.load', 'van'],
      order: { stops: { orderIndex: 'ASC' } },
    });
  }

  async findActiveByVan(vanId: string): Promise<RoutePlan[]> {
    return this.find({
      where: { vanId, status: RouteStatus.ACTIVE },
      relations: ['stops'],
      order: { departureDate: 'ASC' },
    });
  }

  async findSimulationsBySource(sourceRouteId: string): Promise<RoutePlan[]> {
    return this.createQueryBuilder('route')
      .innerJoin('route_simulations', 'sim', 'sim.simulated_route_id = route.id')
      .where('sim.source_route_id = :sourceRouteId', { sourceRouteId })
      .andWhere('route.status = :status', { status: RouteStatus.SIMULATION })
      .leftJoinAndSelect('route.stops', 'stops')
      .orderBy('stops.orderIndex', 'ASC')
      .getMany();
  }
}
