import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoutePlan } from './route-plan.entity';
import { Load } from '../../load/entities/load.entity';
import { StopType, RouteStopStatus } from '../../../common/enums';

/**
 * RouteStop represents a stop on a route plan.
 *
 * CARGO STATE DESIGN:
 * Cargo state is NOT stored per stop. Instead, cargo layout at any point
 * is derived by replaying stop events in order_index sequence:
 *   - PICKUP stop → cargo enters the van
 *   - DELIVERY stop → cargo leaves the van
 *
 * This ensures a single source of truth and avoids stale static copies.
 */
@Entity('route_stops')
@Index('IDX_route_stop_route', ['routePlanId'])
@Index('IDX_route_stop_load', ['loadId'])
@Index('IDX_route_stop_order', ['routePlanId', 'orderIndex'])
export class RouteStop extends BaseEntity {
  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'stop_type', type: 'enum', enum: StopType })
  stopType: StopType;

  @Column({ name: 'status', type: 'enum', enum: RouteStopStatus, default: RouteStopStatus.PENDING })
  status: RouteStopStatus;

  @Column({ name: 'order_index', type: 'int' })
  orderIndex: number;

  @Column({ name: 'group_id', type: 'uuid', nullable: true })
  groupId: string | null;

  // ─── Location ───────────────────────────────────────
  @Column({ name: 'address', length: 255 })
  address: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'postcode', length: 20 })
  postcode: string;

  @Column({ name: 'country', length: 5 })
  country: string;

  @Column({ name: 'lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null;

  @Column({ name: 'lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number | null;

  // ─── Timing ─────────────────────────────────────────
  @Column({ name: 'eta', type: 'timestamptz', nullable: true })
  eta: Date | null;

  @Column({ name: 'etd', type: 'timestamptz', nullable: true })
  etd: Date | null;

  @Column({ name: 'actual_arrival', type: 'timestamptz', nullable: true })
  actualArrival: Date | null;

  @Column({ name: 'actual_departure', type: 'timestamptz', nullable: true })
  actualDeparture: Date | null;

  @Column({ name: 'time_window_from', type: 'timestamptz', nullable: true })
  timeWindowFrom: Date | null;

  @Column({ name: 'time_window_to', type: 'timestamptz', nullable: true })
  timeWindowTo: Date | null;

  @Column({ name: 'time_window_violation', type: 'boolean', default: false })
  timeWindowViolation: boolean;

  // ─── Distance to next stop ──────────────────────────
  @Column({ name: 'distance_to_next_km', type: 'decimal', precision: 8, scale: 1, nullable: true })
  distanceToNextKm: number | null;

  @Column({ name: 'driving_time_to_next_minutes', type: 'int', nullable: true })
  drivingTimeToNextMinutes: number | null;

  // ─── Cargo info (what is picked/delivered here) ─────
  @Column({ name: 'pallets', type: 'int', nullable: true })
  pallets: number | null;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => RoutePlan, (route) => route.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_plan_id' })
  routePlan: RoutePlan;

  @ManyToOne(() => Load, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
