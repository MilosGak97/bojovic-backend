import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'UUID of the parent route plan this stop belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @ApiProperty({
    description: 'UUID of the freight load associated with this stop',
    example: 'c2d3e4f5-a6b7-8901-cdef-012345678901',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiProperty({
    description: 'Whether this stop is a cargo pickup or delivery point',
    example: StopType.PICKUP,
    enum: StopType,
    enumName: 'StopType',
  })
  @Column({ name: 'stop_type', type: 'enum', enum: StopType })
  stopType: StopType;

  @ApiProperty({
    description: 'Current progress status of the vehicle through this stop',
    example: RouteStopStatus.PENDING,
    enum: RouteStopStatus,
    enumName: 'RouteStopStatus',
  })
  @Column({ name: 'status', type: 'enum', enum: RouteStopStatus, default: RouteStopStatus.PENDING })
  status: RouteStopStatus;

  @ApiProperty({
    description: 'Zero-based sequential index determining the visit order of stops on the route',
    example: 2,
    type: Number,
  })
  @Column({ name: 'order_index', type: 'int' })
  orderIndex: number;

  @ApiPropertyOptional({
    description: 'UUID grouping paired pickup and delivery stops for the same load; used to visually link related stops',
    example: 'd4e5f6a7-b8c9-0123-defa-123456789012',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'group_id', type: 'uuid', nullable: true })
  groupId: string | null;

  // ─── Location ───────────────────────────────────────
  @ApiProperty({
    description: 'Full street address of the stop location',
    example: 'Industriestraße 47',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'address', length: 255 })
  address: string;

  @ApiProperty({
    description: 'City name of the stop location',
    example: 'Hamburg',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'city', length: 100 })
  city: string;

  @ApiProperty({
    description: 'Postal code of the stop location',
    example: '20457',
    maxLength: 20,
    type: String,
  })
  @Column({ name: 'postcode', length: 20 })
  postcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the stop location',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @Column({ name: 'country', length: 5 })
  country: string;

  @ApiPropertyOptional({
    description: 'WGS84 latitude coordinate of the stop location',
    example: 53.5488,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null;

  @ApiPropertyOptional({
    description: 'WGS84 longitude coordinate of the stop location',
    example: 9.9872,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number | null;

  // ─── Timing ─────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Estimated time of arrival at this stop (UTC)',
    example: '2024-07-16T09:30:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'eta', type: 'timestamptz', nullable: true })
  eta: Date | null;

  @ApiPropertyOptional({
    description: 'Estimated time of departure from this stop after loading/unloading (UTC)',
    example: '2024-07-16T10:15:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'etd', type: 'timestamptz', nullable: true })
  etd: Date | null;

  @ApiPropertyOptional({
    description: 'Actual recorded arrival time at this stop (UTC); null if not yet reached',
    example: '2024-07-16T09:42:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'actual_arrival', type: 'timestamptz', nullable: true })
  actualArrival: Date | null;

  @ApiPropertyOptional({
    description: 'Actual recorded departure time from this stop (UTC); null if not yet departed',
    example: '2024-07-16T10:20:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'actual_departure', type: 'timestamptz', nullable: true })
  actualDeparture: Date | null;

  @ApiPropertyOptional({
    description: 'Start of the customer-requested delivery or pickup time window (UTC)',
    example: '2024-07-16T08:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'time_window_from', type: 'timestamptz', nullable: true })
  timeWindowFrom: Date | null;

  @ApiPropertyOptional({
    description: 'End of the customer-requested delivery or pickup time window (UTC)',
    example: '2024-07-16T12:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'time_window_to', type: 'timestamptz', nullable: true })
  timeWindowTo: Date | null;

  @ApiProperty({
    description: 'Indicates whether the vehicle arrived outside the agreed customer time window',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'time_window_violation', type: 'boolean', default: false })
  timeWindowViolation: boolean;

  // ─── Distance to next stop ──────────────────────────
  @ApiPropertyOptional({
    description: 'Driving distance from this stop to the next stop on the route in kilometres',
    example: 312.4,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'distance_to_next_km', type: 'decimal', precision: 8, scale: 1, nullable: true })
  distanceToNextKm: number | null;

  @ApiPropertyOptional({
    description: 'Estimated driving time from this stop to the next stop in minutes (excluding rest breaks)',
    example: 195,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'driving_time_to_next_minutes', type: 'int', nullable: true })
  drivingTimeToNextMinutes: number | null;

  // ─── Cargo info (what is picked/delivered here) ─────
  @ApiPropertyOptional({
    description: 'Number of EUR pallets being picked up or delivered at this stop',
    example: 14,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'pallets', type: 'int', nullable: true })
  pallets: number | null;

  @ApiPropertyOptional({
    description: 'Total cargo weight handled at this stop in kilograms',
    example: 8750.00,
    type: Number,
    nullable: true,
  })
  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number | null;

  @ApiPropertyOptional({
    description: 'Free-text notes for this specific stop, e.g. gate codes, contact details, or special handling instructions',
    example: 'Gate B3. Call +49 40 123456 30 min before arrival. Forklift available.',
    nullable: true,
    type: String,
  })
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
