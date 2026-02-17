import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DispatchAssignment } from '../../dispatch/entities/dispatch-assignment.entity';
import { Document } from '../../document/entities/document.entity';
import { DriverStatus } from '../../../common/enums';

@Entity('drivers')
@Index('IDX_driver_status', ['status'])
@Index('IDX_driver_license', ['driverLicenseNumber'])
export class Driver extends BaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'status', type: 'enum', enum: DriverStatus, default: DriverStatus.AVAILABLE })
  status: DriverStatus;

  @Column({ name: 'phone', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'email', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'driver_license_number', length: 50, nullable: true })
  driverLicenseNumber: string | null;

  @Column({ name: 'driver_license_valid_until', type: 'date', nullable: true })
  driverLicenseValidUntil: Date | null;

  @Column({ name: 'driver_license_categories', type: 'simple-array', nullable: true })
  driverLicenseCategories: string[] | null;

  @Column({ name: 'nationality', length: 5, nullable: true })
  nationality: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ name: 'adr_certified', type: 'boolean', default: false })
  adrCertified: boolean;

  @Column({ name: 'adr_valid_until', type: 'date', nullable: true })
  adrValidUntil: Date | null;

  @Column({ name: 'hired_at', type: 'date', nullable: true })
  hiredAt: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // ─── Relations ──────────────────────────────────────
  @OneToMany(() => DispatchAssignment, (assignment) => assignment.driver)
  assignments: DispatchAssignment[];

  @OneToMany(() => Document, (doc) => doc.driver)
  documents: Document[];
}
