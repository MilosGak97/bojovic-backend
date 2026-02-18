import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';

@Entity('load_pallets')
@Index('IDX_load_pallet_load', ['loadId'])
export class LoadPallet extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the parent load this pallet entry belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiPropertyOptional({
    description: 'Optional human-readable label or name for this pallet group',
    example: 'Euro Pallet – Electronics',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'label', type: 'varchar', length: 100, nullable: true })
  label: string | null;

  @ApiProperty({
    description: 'Width of the pallet in centimetres',
    example: 80,
    type: Number,
  })
  @Column({ name: 'width_cm', type: 'int' })
  widthCm: number;

  @ApiProperty({
    description: 'Height of the pallet (including cargo) in centimetres',
    example: 120,
    type: Number,
  })
  @Column({ name: 'height_cm', type: 'int' })
  heightCm: number;

  @ApiPropertyOptional({
    description: 'Depth (length) of the pallet in centimetres',
    example: 120,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'depth_cm', type: 'int', nullable: true })
  depthCm: number | null;

  @ApiPropertyOptional({
    description: 'Gross weight of a single pallet unit in kilograms',
    example: 650.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number | null;

  @ApiProperty({
    description: 'Whether this pallet type can be stacked during transport',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'is_stackable', type: 'boolean', default: false })
  isStackable: boolean;

  @ApiProperty({
    description: 'Number of identical pallet units of this type in the shipment',
    example: 8,
    type: Number,
  })
  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({
    description: 'Zero-based index determining the display order of this pallet entry',
    example: 0,
    type: Number,
  })
  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.pallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
