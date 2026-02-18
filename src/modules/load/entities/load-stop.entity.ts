import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';
import { StopType } from '../../../common/enums';

@Entity('load_stops')
@Index('IDX_load_stop_load', ['loadId'])
@Index('IDX_load_stop_type', ['stopType'])
export class LoadStop extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the parent load this stop belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiProperty({
    description: 'Whether this stop is a pickup or delivery point',
    example: StopType.PICKUP,
    enum: StopType,
    enumName: 'StopType',
  })
  @Column({ name: 'stop_type', type: 'enum', enum: StopType })
  stopType: StopType;

  @ApiProperty({
    description: 'Full street address of the stop',
    example: 'Logistikzentrum Süd, Am Hafen 5',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'address', length: 255 })
  address: string;

  @ApiProperty({
    description: 'City where the stop is located',
    example: 'Munich',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'city', length: 100 })
  city: string;

  @ApiProperty({
    description: 'Postal code of the stop location',
    example: '80331',
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
    description: 'Latitude coordinate of the stop (WGS 84)',
    example: 48.1351,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'lat', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the stop (WGS 84)',
    example: 11.582,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'lng', type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number | null;

  @ApiProperty({
    description: 'Earliest date and time the stop must be serviced (UTC)',
    example: '2026-02-20T07:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @Column({ name: 'date_from', type: 'timestamptz' })
  dateFrom: Date;

  @ApiPropertyOptional({
    description: 'Latest date and time by which the stop must be serviced (UTC)',
    example: '2026-02-20T12:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'date_to', type: 'timestamptz', nullable: true })
  dateTo: Date | null;

  @ApiPropertyOptional({
    description: 'Name of the on-site contact person at this stop',
    example: 'Hans Weber',
    maxLength: 200,
    nullable: true,
    type: String,
  })
  @Column({ name: 'contact_name', type: 'varchar', length: 200, nullable: true })
  contactName: string | null;

  @ApiPropertyOptional({
    description: 'Phone number of the on-site contact person at this stop',
    example: '+49 89 987654321',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({
    description: 'Free-text notes or special instructions for this stop',
    example: 'Gate B – ring bell. Hard hat required on site.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ApiPropertyOptional({
    description: 'Number of pallets loaded or unloaded at this stop',
    example: 4,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'pallets', type: 'int', nullable: true })
  pallets: number | null;

  @ApiPropertyOptional({
    description: 'Optional Transeu link specific to this stop',
    example: 'https://transeu.com/offers/12345',
    maxLength: 500,
    nullable: true,
    type: String,
  })
  @Column({ name: 'transeu_link', type: 'varchar', length: 500, nullable: true })
  transeuLink: string | null;

  @ApiProperty({
    description: 'Zero-based position index determining the order of stops on the route',
    example: 0,
    type: Number,
  })
  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
