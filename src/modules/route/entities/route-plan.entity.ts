import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Van } from '../../van/entities/van.entity';
import { RouteStop } from './route-stop.entity';
import { RouteSimulation } from './route-simulation.entity';
import { RouteStatus } from '../../../common/enums';

@Entity('route_plans')
@Index('IDX_route_plan_van', ['vanId'])
@Index('IDX_route_plan_status', ['status'])
@Index('IDX_route_plan_date', ['departureDate'])
export class RoutePlan extends BaseEntity {
  @ApiPropertyOptional({
    description: 'Human-readable name for the route plan',
    example: 'Warsaw → Berlin → Hamburg run',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string | null;

  @ApiProperty({
    description: 'Current operational state of the route plan',
    example: RouteStatus.DRAFT,
    enum: RouteStatus,
    enumName: 'RouteStatus',
  })
  @Column({ name: 'status', type: 'enum', enum: RouteStatus, default: RouteStatus.DRAFT })
  status: RouteStatus;

  @ApiPropertyOptional({
    description: 'UUID of the van assigned to this route plan',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'van_id', type: 'uuid', nullable: true })
  vanId: string | null;

  @ApiPropertyOptional({
    description: 'Planned departure date and time for the route (UTC)',
    example: '2024-07-15T05:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'departure_date', type: 'timestamptz', nullable: true })
  departureDate: Date | null;

  @ApiPropertyOptional({
    description: 'Expected arrival date and time at the final destination (UTC)',
    example: '2024-07-16T18:30:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'arrival_date', type: 'timestamptz', nullable: true })
  arrivalDate: Date | null;

  // ─── Computed totals (cached) ───────────────────────
  @ApiPropertyOptional({
    description: 'Cached total driving distance for the entire route in kilometres',
    example: 1248.5,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'total_distance_km', type: 'decimal', precision: 10, scale: 1, nullable: true })
  totalDistanceKm: number | null;

  @ApiPropertyOptional({
    description: 'Cached total estimated driving time for the entire route in minutes',
    example: 780,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'total_time_minutes', type: 'int', nullable: true })
  totalTimeMinutes: number | null;

  @ApiPropertyOptional({
    description: 'Cached estimated fuel consumption for the entire route in litres',
    example: 187.50,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'estimated_fuel_liters', type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimatedFuelLiters: number | null;

  @ApiPropertyOptional({
    description: 'Cached estimated total fuel cost for the route in the account currency (EUR)',
    example: 281.25,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'fuel_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelCost: number | null;

  @ApiPropertyOptional({
    description: 'Cached total revenue expected from all loads on this route',
    example: 4200.00,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'total_revenue', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalRevenue: number | null;

  @ApiPropertyOptional({
    description: 'Cached estimated margin (revenue minus fuel cost) for the route',
    example: 3918.75,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'estimated_margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedMargin: number | null;

  @ApiPropertyOptional({
    description: 'Cached effective price per kilometre driven on this route',
    example: 3.3654,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'price_per_km', type: 'decimal', precision: 8, scale: 4, nullable: true })
  pricePerKm: number | null;

  @ApiPropertyOptional({
    description: 'Free-text dispatcher notes or instructions for this route plan',
    example: 'Check customs documents at DE border. Avoid toll road A2 between Frankfurt and Hannover.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Van, (van) => van.routes, { nullable: true })
  @JoinColumn({ name: 'van_id' })
  van: Van | null;

  @OneToMany(() => RouteStop, (stop) => stop.routePlan, { cascade: true })
  stops: RouteStop[];

  @OneToMany(() => RouteSimulation, (sim) => sim.sourceRoute)
  simulations: RouteSimulation[];
}
