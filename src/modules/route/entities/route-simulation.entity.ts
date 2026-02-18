import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'UUID of the live route plan this simulation is based on. The source route is never modified until the simulation is explicitly applied.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'source_route_id', type: 'uuid' })
  sourceRouteId: string;

  @ApiProperty({
    description: 'UUID of the cloned route plan (status=SIMULATION) where what-if modifications are applied',
    example: 'b2c3d4e5-f6a7-8901-bcde-f01234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'simulated_route_id', type: 'uuid' })
  simulatedRouteId: string;

  @ApiPropertyOptional({
    description: 'Human-readable label for this simulation scenario',
    example: 'Add Łódź pickup — check margin impact',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string | null;

  // ─── Deltas ─────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Difference in total route distance between the simulation and the source route in kilometres; negative means the simulation is shorter',
    example: -87.3,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'delta_distance_km', type: 'decimal', precision: 10, scale: 1, nullable: true })
  deltaDistanceKm: number | null;

  @ApiPropertyOptional({
    description: 'Difference in total driving time between the simulation and the source route in minutes; negative means the simulation is faster',
    example: -55,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'delta_time_minutes', type: 'int', nullable: true })
  deltaTimeMinutes: number | null;

  @ApiPropertyOptional({
    description: 'Difference in estimated fuel consumption between the simulation and the source route in litres; negative means the simulation burns less fuel',
    example: -13.10,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'delta_fuel_liters', type: 'decimal', precision: 8, scale: 2, nullable: true })
  deltaFuelLiters: number | null;

  @ApiPropertyOptional({
    description: 'Difference in estimated margin (revenue minus costs) between the simulation and the source route; positive means the simulation is more profitable',
    example: 320.00,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'delta_margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  deltaMargin: number | null;

  @ApiPropertyOptional({
    description: 'List of validation warnings generated during simulation computation, e.g. time-window violations or overweight alerts',
    example: ['Stop 3 arrives 45 min after time window closes', 'Van capacity exceeded by 2 pallets after stop 5'],
    type: [String],
    nullable: true,
  })
  @Column({ name: 'warnings', type: 'simple-array', nullable: true })
  warnings: string[] | null;

  @ApiProperty({
    description: 'Whether this simulation has been applied to (swapped with) the source route. Once true the simulation is immutable.',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'is_applied', type: 'boolean', default: false })
  isApplied: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when the simulation was applied to the source route (UTC); null while the simulation is still pending review',
    example: '2024-07-14T11:05:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
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
