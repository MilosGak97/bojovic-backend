import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';

@Entity('load_pallets')
@Index('IDX_load_pallet_load', ['loadId'])
export class LoadPallet extends BaseEntity {
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'label', length: 100, nullable: true })
  label: string | null;

  @Column({ name: 'width_cm', type: 'int' })
  widthCm: number;

  @Column({ name: 'height_cm', type: 'int' })
  heightCm: number;

  @Column({ name: 'depth_cm', type: 'int', nullable: true })
  depthCm: number | null;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number | null;

  @Column({ name: 'is_stackable', type: 'boolean', default: false })
  isStackable: boolean;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.pallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
