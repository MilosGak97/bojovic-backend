import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
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
  @Column({ name: 'van_id', type: 'uuid' })
  vanId: string;

  @Column({ name: 'driver_id', type: 'uuid' })
  driverId: string;

  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @Column({ name: 'status', type: 'enum', enum: DispatchStatus, default: DispatchStatus.PLANNED })
  status: DispatchStatus;

  @Column({ name: 'assigned_date', type: 'date' })
  assignedDate: Date;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

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
