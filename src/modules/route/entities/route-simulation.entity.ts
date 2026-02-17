import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoutePlan } from './route-plan.entity';
import { RouteStop } from './route-stop.entity';

/**
 * RouteSimulation represents a "what-if" clone of an active route.
 *
 * SIMULATION ALGORITHM:
 * 1. Clone the source route's stops into a new RoutePlan with status=SIMULATION
 * 2. Allow modifications (add/remove/reorder stops, add loads)
 * 3. Compute metrics on the simulation (distance, time, fuel, margin)
 * 4. Calculate deltas vs. source route
 * 5. If user approves → apply simulation to active route (swap)
 * 6. If user rejects → discard simulation
 *
 * The source route is NEVER modified until the simulation is applied.
 */
@Entity('route_simulations')
@Index('IDX_simulation_source', ['sourceRouteId'])
@Index('IDX_simulation_simulated', ['simulatedRouteId'])
export class RouteSimulation extends BaseEntity {
  @Column({ name: 'source_route_id', type: 'uuid' })
  sourceRouteId: string;

  @Column({ name: 'simulated_route_id', type: 'uuid' })
  simulatedRouteId: string;

  @Column({ name: 'name', length: 100, nullable: true })
  name: string | null;

  // ─── Deltas ─────────────────────────────────────────
  @Column({ name: 'delta_distance_km', type: 'decimal', precision: 10, scale: 1, nullable: true })
  deltaDistanceKm: number | null;

  @Column({ name: 'delta_time_minutes', type: 'int', nullable: true })
  deltaTimeMinutes: number | null;

  @Column({ name: 'delta_fuel_liters', type: 'decimal', precision: 8, scale: 2, nullable: true })
  deltaFuelLiters: number | null;

  @Column({ name: 'delta_margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  deltaMargin: number | null;

  @Column({ name: 'warnings', type: 'simple-array', nullable: true })
  warnings: string[] | null;

  @Column({ name: 'is_applied', type: 'boolean', default: false })
  isApplied: boolean;

  @Column({ name: 'applied_at', type: 'timestamptz', nullable: true })
  appliedAt: Date | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => RoutePlan, (route) => route.simulations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_route_id' })
  sourceRoute: RoutePlan;

  @ManyToOne(() => RoutePlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'simulated_route_id' })
  simulatedRoute: RoutePlan;
}
