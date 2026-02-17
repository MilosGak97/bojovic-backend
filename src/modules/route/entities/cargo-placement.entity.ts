import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from '../../load/entities/load.entity';
import { LoadPallet } from '../../load/entities/load-pallet.entity';
import { RoutePlan } from './route-plan.entity';

/**
 * CargoPlacement tracks the physical position of cargo items in the van's cargo area.
 *
 * TIMELINE-BASED CARGO STATE:
 * Unlike static per-stop snapshots, placements are linked to the route (not individual stops).
 * The cargo state at any given stop is derived by:
 *   1. Start with empty cargo area
 *   2. For each stop in order_index ASC:
 *      - If PICKUP: add CargoPlacement items where loadId matches the stop's load
 *      - If DELIVERY: remove CargoPlacement items where loadId matches the stop's load
 *   3. Current cargo layout = all placements for loads currently on board
 *
 * This allows the frontend to visualize cargo at any point in the route.
 */
@Entity('cargo_placements')
@Index('IDX_cargo_route', ['routePlanId'])
@Index('IDX_cargo_load', ['loadId'])
@Index('IDX_cargo_pallet', ['palletId'])
export class CargoPlacement extends BaseEntity {
  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'pallet_id', type: 'uuid', nullable: true })
  palletId: string | null;

  @Column({ name: 'label', length: 100, nullable: true })
  label: string | null;

  // ─── Position in cargo area (cm) ────────────────────
  @Column({ name: 'x_cm', type: 'int' })
  xCm: number;

  @Column({ name: 'y_cm', type: 'int' })
  yCm: number;

  @Column({ name: 'width_cm', type: 'int' })
  widthCm: number;

  @Column({ name: 'height_cm', type: 'int' })
  heightCm: number;

  @Column({ name: 'rotated', type: 'boolean', default: false })
  rotated: boolean;

  @Column({ name: 'has_conflict', type: 'boolean', default: false })
  hasConflict: boolean;

  @Column({ name: 'is_overflow', type: 'boolean', default: false })
  isOverflow: boolean;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => RoutePlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_plan_id' })
  routePlan: RoutePlan;

  @ManyToOne(() => Load, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;

  @ManyToOne(() => LoadPallet, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pallet_id' })
  pallet: LoadPallet | null;
}
