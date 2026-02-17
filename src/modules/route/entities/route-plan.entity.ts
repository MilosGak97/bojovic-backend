import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
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
  @Column({ name: 'name', length: 100, nullable: true })
  name: string | null;

  @Column({ name: 'status', type: 'enum', enum: RouteStatus, default: RouteStatus.DRAFT })
  status: RouteStatus;

  @Column({ name: 'van_id', type: 'uuid', nullable: true })
  vanId: string | null;

  @Column({ name: 'departure_date', type: 'timestamptz', nullable: true })
  departureDate: Date | null;

  @Column({ name: 'arrival_date', type: 'timestamptz', nullable: true })
  arrivalDate: Date | null;

  // ─── Computed totals (cached) ───────────────────────
  @Column({ name: 'total_distance_km', type: 'decimal', precision: 10, scale: 1, nullable: true })
  totalDistanceKm: number | null;

  @Column({ name: 'total_time_minutes', type: 'int', nullable: true })
  totalTimeMinutes: number | null;

  @Column({ name: 'estimated_fuel_liters', type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimatedFuelLiters: number | null;

  @Column({ name: 'fuel_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelCost: number | null;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalRevenue: number | null;

  @Column({ name: 'estimated_margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedMargin: number | null;

  @Column({ name: 'price_per_km', type: 'decimal', precision: 8, scale: 4, nullable: true })
  pricePerKm: number | null;

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
