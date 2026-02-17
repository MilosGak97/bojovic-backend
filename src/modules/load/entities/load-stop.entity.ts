import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';
import { StopType } from '../../../common/enums';

@Entity('load_stops')
@Index('IDX_load_stop_load', ['loadId'])
@Index('IDX_load_stop_type', ['stopType'])
export class LoadStop extends BaseEntity {
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'stop_type', type: 'enum', enum: StopType })
  stopType: StopType;

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

  @Column({ name: 'date_from', type: 'timestamptz' })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'timestamptz', nullable: true })
  dateTo: Date | null;

  @Column({ name: 'contact_name', length: 200, nullable: true })
  contactName: string | null;

  @Column({ name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
