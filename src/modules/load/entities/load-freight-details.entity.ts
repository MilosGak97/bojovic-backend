import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from './load.entity';
import { BodyType } from '../../../common/enums';

@Entity('load_freight_details')
@Index('IDX_freight_details_load', ['loadId'], { unique: true })
export class LoadFreightDetails extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the load these freight details belong to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiPropertyOptional({
    description: 'Total gross weight of the cargo in metric tonnes',
    example: 18.5,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'weight_tons', type: 'decimal', precision: 8, scale: 3, nullable: true })
  weightTons: number | null;

  @ApiPropertyOptional({
    description: 'Loading metres occupied by the cargo on a standard trailer floor',
    example: 7.4,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'loading_meters', type: 'decimal', precision: 6, scale: 2, nullable: true })
  loadingMeters: number | null;

  @ApiPropertyOptional({
    description: 'Total volume of the cargo in cubic metres',
    example: 42.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'volume_m3', type: 'decimal', precision: 8, scale: 2, nullable: true })
  volumeM3: number | null;

  @ApiPropertyOptional({
    description: 'Number of pallets included in this shipment',
    example: 16,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'pallet_count', type: 'int', nullable: true })
  palletCount: number | null;

  @ApiPropertyOptional({
    description: 'Required trailer/vehicle body type for transporting this load',
    example: BodyType.CURTAINSIDER,
    enum: BodyType,
    enumName: 'BodyType',
    nullable: true,
  })
  @Column({ name: 'body_type', type: 'enum', enum: BodyType, nullable: true })
  bodyType: BodyType | null;

  @ApiProperty({
    description: 'Whether the cargo can be stacked on top of other goods',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'is_stackable', type: 'boolean', default: false })
  isStackable: boolean;

  @ApiProperty({
    description: 'Whether the cargo is classified as hazardous (ADR)',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'is_hazardous', type: 'boolean', default: false })
  isHazardous: boolean;

  @ApiPropertyOptional({
    description: 'ADR hazard class of the cargo (e.g. "3" for flammable liquids)',
    example: '3',
    maxLength: 20,
    nullable: true,
    type: String,
  })
  @Column({ name: 'adr_class', type: 'varchar', length: 20, nullable: true })
  adrClass: string | null;

  @ApiPropertyOptional({
    description: 'Minimum required transport temperature in degrees Celsius',
    example: 2.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'temperature_min', type: 'decimal', precision: 5, scale: 1, nullable: true })
  temperatureMin: number | null;

  @ApiPropertyOptional({
    description: 'Maximum allowed transport temperature in degrees Celsius',
    example: 8.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'temperature_max', type: 'decimal', precision: 5, scale: 1, nullable: true })
  temperatureMax: number | null;

  @ApiPropertyOptional({
    description: 'Human-readable description of the goods being transported',
    example: 'Automotive spare parts – engine components, packaged in wooden crates',
    nullable: true,
    type: String,
  })
  @Column({ name: 'goods_description', type: 'text', nullable: true })
  goodsDescription: string | null;

  // ─── Relations ──────────────────────────────────────
  @OneToOne(() => Load, (load) => load.freightDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'load_id' })
  load: Load;
}
