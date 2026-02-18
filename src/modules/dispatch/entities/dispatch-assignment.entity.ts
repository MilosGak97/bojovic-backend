import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Van } from '../../van/entities/van.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { RoutePlan } from '../../route/entities/route-plan.entity';
import { DispatchStatus } from '../../../common/enums';

@Entity('dispatch_assignments')
@Index('IDX_dispatch_van', ['vanId'])
@Index('IDX_dispatch_driver', ['driverId'])
@Index('IDX_dispatch_route', ['routePlanId'])
@Index('IDX_dispatch_status', ['status'])
@Index('IDX_dispatch_date', ['assignedDate'])
export class DispatchAssignment extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the van assigned to this dispatch',
    example: 'b3c4d5e6-f7a8-4901-bcde-f01234567891',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'van_id', type: 'uuid' })
  vanId: string;

  @ApiProperty({
    description: 'UUID of the driver assigned to this dispatch',
    example: 'c4d5e6f7-a8b9-4012-cdef-012345678912',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'driver_id', type: 'uuid' })
  driverId: string;

  @ApiProperty({
    description: 'UUID of the route plan this dispatch is executing',
    example: 'd5e6f7a8-b9c0-4123-defa-123456789023',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @ApiProperty({
    description:
      'Current lifecycle status of the dispatch assignment. Follows the flow: PLANNED -> ASSIGNED -> IN_PROGRESS -> COMPLETED (or CANCELED at any stage)',
    example: DispatchStatus.PLANNED,
    enum: DispatchStatus,
    enumName: 'DispatchStatus',
    default: DispatchStatus.PLANNED,
  })
  @Column({ name: 'status', type: 'enum', enum: DispatchStatus, default: DispatchStatus.PLANNED })
  status: DispatchStatus;

  @ApiProperty({
    description: 'Calendar date on which this dispatch is scheduled to operate (ISO 8601 date)',
    example: '2026-02-17',
    format: 'date',
    type: String,
  })
  @Column({ name: 'assigned_date', type: 'date' })
  assignedDate: Date;

  @ApiPropertyOptional({
    description:
      'Timestamp (with timezone) when the dispatch execution began. Null until the driver marks the dispatch as started',
    example: '2026-02-17T06:30:00.000Z',
    format: 'date-time',
    type: String,
    nullable: true,
  })
  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @ApiPropertyOptional({
    description:
      'Timestamp (with timezone) when the dispatch was marked as completed. Null until all stops have been serviced',
    example: '2026-02-17T18:45:00.000Z',
    format: 'date-time',
    type: String,
    nullable: true,
  })
  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @ApiPropertyOptional({
    description:
      'Free-text notes or instructions for this dispatch (e.g. special handling requirements, customer contact info)',
    example: 'Call the warehouse manager 30 minutes before arrival. Gate code: 4821.',
    type: String,
    nullable: true,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Van, (van) => van.assignments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'van_id' })
  van: Van;

  @ManyToOne(() => Driver, (driver) => driver.assignments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => RoutePlan, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'route_plan_id' })
  routePlan: RoutePlan;
}
