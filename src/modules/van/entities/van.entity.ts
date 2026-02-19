import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DispatchAssignment } from '../../dispatch/entities/dispatch-assignment.entity';
import { RoutePlan } from '../../route/entities/route-plan.entity';
import { Document } from '../../document/entities/document.entity';
import { VanStatus, VanType, Currency } from '../../../common/enums';

@Entity('vans')
@Index('IDX_van_license', ['licensePlate'], { unique: true })
@Index('IDX_van_status', ['status'])
export class Van extends BaseEntity {
  @ApiProperty({
    description: 'Human-readable display name for the van',
    example: 'Van Berlin 01',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'name', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Unique vehicle license plate number',
    example: 'B-VD-2301',
    maxLength: 20,
    type: String,
  })
  @Column({ name: 'license_plate', length: 20 })
  licensePlate: string;

  @ApiProperty({
    description: 'Current operational status of the van',
    example: VanStatus.AVAILABLE,
    enum: VanStatus,
    enumName: 'VanStatus',
    default: VanStatus.AVAILABLE,
  })
  @Column({ name: 'status', type: 'enum', enum: VanStatus, default: VanStatus.AVAILABLE })
  status: VanStatus;

  @ApiProperty({
    description: 'High-level vehicle class used for planning presets',
    example: VanType.VAN_3_5T,
    enum: VanType,
    enumName: 'VanType',
    default: VanType.CARGO_VAN,
  })
  @Column({
    name: 'vehicle_type',
    type: 'enum',
    enum: VanType,
    enumName: 'van_type_enum',
    default: VanType.CARGO_VAN,
  })
  vehicleType: VanType;

  // ─── Capacity ───────────────────────────────────────
  @ApiProperty({
    description: 'Maximum payload weight the van can carry in kilograms',
    example: 3500,
    type: Number,
    format: 'decimal',
  })
  @Column({ name: 'max_weight_kg', type: 'decimal', precision: 8, scale: 2 })
  maxWeightKg: number;

  @ApiProperty({
    description: 'Internal cargo compartment length in centimetres',
    example: 403,
    type: Number,
  })
  @Column({ name: 'cargo_length_cm', type: 'int' })
  cargoLengthCm: number;

  @ApiProperty({
    description: 'Internal cargo compartment width in centimetres',
    example: 220,
    type: Number,
  })
  @Column({ name: 'cargo_width_cm', type: 'int' })
  cargoWidthCm: number;

  @ApiProperty({
    description: 'Internal cargo compartment height in centimetres',
    example: 220,
    type: Number,
  })
  @Column({ name: 'cargo_height_cm', type: 'int' })
  cargoHeightCm: number;

  @ApiPropertyOptional({
    description:
      'Maximum load length expressed as loading metres (LDM); null when not applicable',
    example: 7.2,
    nullable: true,
    type: Number,
    format: 'decimal',
  })
  @Column({ name: 'max_loading_meters', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxLoadingMeters: number | null;

  @ApiPropertyOptional({
    description: 'Maximum number of euro pallets (80 × 120 cm) the van can carry; null when not applicable',
    example: 6,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'max_pallets', type: 'int', nullable: true })
  maxPallets: number | null;

  // ─── Vehicle Info ───────────────────────────────────
  @ApiPropertyOptional({
    description: 'Vehicle manufacturer / brand name',
    example: 'Mercedes-Benz',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'make', type: 'varchar', length: 100, nullable: true })
  make: string | null;

  @ApiPropertyOptional({
    description: 'Vehicle model designation',
    example: 'Sprinter 316 CDI',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'model', type: 'varchar', length: 100, nullable: true })
  model: string | null;

  @ApiPropertyOptional({
    description: 'Four-digit year of manufacture',
    example: 2021,
    nullable: true,
    type: Number,
    minimum: 1900,
    maximum: 2100,
  })
  @Column({ name: 'year', type: 'int', nullable: true })
  year: number | null;

  @ApiPropertyOptional({
    description: 'Average fuel consumption in litres per 100 kilometres',
    example: 8.5,
    nullable: true,
    type: Number,
    format: 'decimal',
  })
  @Column({ name: 'fuel_consumption_per_100km', type: 'decimal', precision: 5, scale: 2, nullable: true })
  fuelConsumptionPer100km: number | null;

  @ApiPropertyOptional({
    description: 'Current odometer reading in kilometres',
    example: 124500,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'odometer_km', type: 'int', nullable: true })
  odometerKm: number | null;

  @ApiPropertyOptional({
    description: 'Date of the next scheduled vehicle service (ISO 8601 date)',
    example: '2026-06-15',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'next_service_date', type: 'date', nullable: true })
  nextServiceDate: Date | null;

  @ApiPropertyOptional({
    description: 'Date until which the vehicle insurance policy is valid (ISO 8601 date)',
    example: '2026-12-31',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'insurance_valid_until', type: 'date', nullable: true })
  insuranceValidUntil: Date | null;

  @ApiPropertyOptional({
    description: 'Date until which the technical roadworthiness inspection (TUV / MOT) is valid (ISO 8601 date)',
    example: '2027-03-01',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'technical_inspection_until', type: 'date', nullable: true })
  technicalInspectionUntil: Date | null;

  @ApiPropertyOptional({
    description: 'Fixed monthly leasing cost for this vehicle',
    example: 980.00,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'monthly_leasing_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyLeasingCost: number | null;

  @ApiPropertyOptional({
    description: 'Fixed monthly insurance cost for this vehicle',
    example: 240.00,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'monthly_insurance_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyInsuranceCost: number | null;

  @ApiPropertyOptional({
    description: 'Currency used for fixed monthly cost fields',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    nullable: true,
  })
  @Column({
    name: 'cost_currency',
    type: 'enum',
    enum: Currency,
    enumName: 'van_cost_currency_enum',
    nullable: true,
  })
  costCurrency: Currency | null;

  @ApiPropertyOptional({
    description: 'Free-text notes or remarks about the van (e.g. known issues, special equipment)',
    example: 'Tail-lift installed. Requires pre-booking for ferry crossings.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @OneToMany(() => DispatchAssignment, (assignment) => assignment.van)
  assignments: DispatchAssignment[];

  @OneToMany(() => RoutePlan, (route) => route.van)
  routes: RoutePlan[];

  @OneToMany(() => Document, (doc) => doc.van)
  documents: Document[];
}
