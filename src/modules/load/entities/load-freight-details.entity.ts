import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';
import { BodyType } from '../../../common/enums';

@Entity('load_freight_details')
@Index('IDX_freight_details_load', ['loadId'], { unique: true })
export class LoadFreightDetails extends BaseEntity {
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'weight_tons', type: 'decimal', precision: 8, scale: 3, nullable: true })
  weightTons: number | null;

  @Column({ name: 'loading_meters', type: 'decimal', precision: 6, scale: 2, nullable: true })
  loadingMeters: number | null;

  @Column({ name: 'volume_m3', type: 'decimal', precision: 8, scale: 2, nullable: true })
  volumeM3: number | null;

  @Column({ name: 'pallet_count', type: 'int', nullable: true })
  palletCount: number | null;

  @Column({ name: 'body_type', type: 'enum', enum: BodyType, nullable: true })
  bodyType: BodyType | null;

  @Column({ name: 'is_stackable', type: 'boolean', default: false })
  isStackable: boolean;

  @Column({ name: 'is_hazardous', type: 'boolean', default: false })
  isHazardous: boolean;

  @Column({ name: 'adr_class', length: 20, nullable: true })
  adrClass: string | null;

  @Column({ name: 'temperature_min', type: 'decimal', precision: 5, scale: 1, nullable: true })
  temperatureMin: number | null;

  @Column({ name: 'temperature_max', type: 'decimal', precision: 5, scale: 1, nullable: true })
  temperatureMax: number | null;

  @Column({ name: 'goods_description', type: 'text', nullable: true })
  goodsDescription: string | null;

  // ─── Relations ──────────────────────────────────────
  @OneToOne(() => Load, (load) => load.freightDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
