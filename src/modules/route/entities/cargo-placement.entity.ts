import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'UUID of the route plan this cargo placement belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'route_plan_id', type: 'uuid' })
  routePlanId: string;

  @ApiProperty({
    description: 'UUID of the freight load whose cargo item is placed in the van',
    example: 'c2d3e4f5-a6b7-8901-cdef-012345678901',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiPropertyOptional({
    description: 'UUID of the specific pallet within the load that is placed; null when the placement represents the whole load without individual pallet granularity',
    example: 'e5f6a7b8-c9d0-1234-efab-234567890123',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'pallet_id', type: 'uuid', nullable: true })
  palletId: string | null;

  @ApiPropertyOptional({
    description: 'Human-readable label shown on the cargo area visualisation (e.g. load reference or commodity name)',
    example: 'PLN-2024-0047 / Auto parts',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'label', type: 'varchar', length: 100, nullable: true })
  label: string | null;

  // ─── Position in cargo area (cm) ────────────────────
  @ApiProperty({
    description: 'Horizontal offset from the left wall of the cargo area in centimetres (X axis, measured from the driver cab side)',
    example: 120,
    type: Number,
  })
  @Column({ name: 'x_cm', type: 'int' })
  xCm: number;

  @ApiProperty({
    description: 'Vertical offset from the rear door of the cargo area in centimetres (Y axis, measured from the rear door inward)',
    example: 0,
    type: Number,
  })
  @Column({ name: 'y_cm', type: 'int' })
  yCm: number;

  @ApiProperty({
    description: 'Width of the cargo item footprint in the cargo area in centimetres (along the X axis)',
    example: 120,
    type: Number,
  })
  @Column({ name: 'width_cm', type: 'int' })
  widthCm: number;

  @ApiProperty({
    description: 'Depth of the cargo item footprint in the cargo area in centimetres (along the Y axis)',
    example: 80,
    type: Number,
  })
  @Column({ name: 'height_cm', type: 'int' })
  heightCm: number;

  @ApiProperty({
    description: 'Whether the cargo item has been rotated 90 degrees on the cargo area floor plan (swaps width and depth)',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'rotated', type: 'boolean', default: false })
  rotated: boolean;

  @ApiProperty({
    description: 'Whether this placement overlaps with another cargo item; flagged by the packing algorithm to warn the dispatcher',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'has_conflict', type: 'boolean', default: false })
  hasConflict: boolean;

  @ApiProperty({
    description: 'Whether this cargo item extends beyond the van\'s usable cargo area boundary; indicates the van may be overloaded or the load does not physically fit',
    example: false,
    type: Boolean,
  })
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
