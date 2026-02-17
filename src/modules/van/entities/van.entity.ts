import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DispatchAssignment } from '../../dispatch/entities/dispatch-assignment.entity';
import { RoutePlan } from '../../route/entities/route-plan.entity';
import { Document } from '../../document/entities/document.entity';
import { VanStatus } from '../../../common/enums';

@Entity('vans')
@Index('IDX_van_license', ['licensePlate'], { unique: true })
@Index('IDX_van_status', ['status'])
export class Van extends BaseEntity {
  @Column({ name: 'name', length: 100 })
  name: string;

  @Column({ name: 'license_plate', length: 20 })
  licensePlate: string;

  @Column({ name: 'status', type: 'enum', enum: VanStatus, default: VanStatus.AVAILABLE })
  status: VanStatus;

  // ─── Capacity ───────────────────────────────────────
  @Column({ name: 'max_weight_kg', type: 'decimal', precision: 8, scale: 2 })
  maxWeightKg: number;

  @Column({ name: 'cargo_length_cm', type: 'int' })
  cargoLengthCm: number;

  @Column({ name: 'cargo_width_cm', type: 'int' })
  cargoWidthCm: number;

  @Column({ name: 'cargo_height_cm', type: 'int' })
  cargoHeightCm: number;

  @Column({ name: 'max_loading_meters', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxLoadingMeters: number | null;

  @Column({ name: 'max_pallets', type: 'int', nullable: true })
  maxPallets: number | null;

  // ─── Vehicle Info ───────────────────────────────────
  @Column({ name: 'make', length: 100, nullable: true })
  make: string | null;

  @Column({ name: 'model', length: 100, nullable: true })
  model: string | null;

  @Column({ name: 'year', type: 'int', nullable: true })
  year: number | null;

  @Column({ name: 'fuel_consumption_per_100km', type: 'decimal', precision: 5, scale: 2, nullable: true })
  fuelConsumptionPer100km: number | null;

  @Column({ name: 'odometer_km', type: 'int', nullable: true })
  odometerKm: number | null;

  @Column({ name: 'next_service_date', type: 'date', nullable: true })
  nextServiceDate: Date | null;

  @Column({ name: 'insurance_valid_until', type: 'date', nullable: true })
  insuranceValidUntil: Date | null;

  @Column({ name: 'technical_inspection_until', type: 'date', nullable: true })
  technicalInspectionUntil: Date | null;

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
