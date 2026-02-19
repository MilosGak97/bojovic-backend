import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DispatchAssignment } from '../../dispatch/entities/dispatch-assignment.entity';
import { Document } from '../../document/entities/document.entity';
import { DriverStatus, Currency } from '../../../common/enums';

@Entity('drivers')
@Index('IDX_driver_status', ['status'])
@Index('IDX_driver_license', ['driverLicenseNumber'])
export class Driver extends BaseEntity {
  @ApiProperty({
    description: 'First name of the driver',
    example: 'Klaus',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the driver',
    example: 'Müller',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'Current operational duty state of the driver',
    example: DriverStatus.AVAILABLE,
    enum: DriverStatus,
    enumName: 'DriverStatus',
    default: DriverStatus.AVAILABLE,
  })
  @Column({ name: 'status', type: 'enum', enum: DriverStatus, default: DriverStatus.AVAILABLE })
  status: DriverStatus;

  @ApiPropertyOptional({
    description: 'Contact phone number of the driver',
    example: '+49 151 23456789',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Contact email address of the driver',
    example: 'k.mueller@spedition-berlin.de',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @ApiPropertyOptional({
    description: 'Official driver licence number as printed on the document',
    example: 'B072-123456-DL9',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'driver_license_number', type: 'varchar', length: 50, nullable: true })
  driverLicenseNumber: string | null;

  @ApiPropertyOptional({
    description: 'Expiry date of the driver licence (ISO 8601 date)',
    example: '2028-03-15',
    format: 'date',
    nullable: true,
    type: String,
  })
  @Column({ name: 'driver_license_valid_until', type: 'date', nullable: true })
  driverLicenseValidUntil: Date | null;

  @ApiPropertyOptional({
    description: 'List of EU driver licence categories held by the driver',
    example: ['B', 'C', 'CE'],
    isArray: true,
    nullable: true,
    type: [String],
  })
  @Column({ name: 'driver_license_categories', type: 'simple-array', nullable: true })
  driverLicenseCategories: string[] | null;

  @ApiPropertyOptional({
    description: 'ISO 3166-1 alpha-2 country code representing the driver\'s nationality',
    example: 'DE',
    maxLength: 5,
    nullable: true,
    type: String,
  })
  @Column({ name: 'nationality', type: 'varchar', length: 5, nullable: true })
  nationality: string | null;

  @ApiPropertyOptional({
    description: 'Date of birth of the driver (ISO 8601 date)',
    example: '1985-07-22',
    format: 'date',
    nullable: true,
    type: String,
  })
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @ApiProperty({
    description: 'Indicates whether the driver holds a valid ADR certificate for carrying dangerous goods',
    example: false,
    default: false,
    type: Boolean,
  })
  @Column({ name: 'adr_certified', type: 'boolean', default: false })
  adrCertified: boolean;

  @ApiPropertyOptional({
    description: 'Expiry date of the ADR (dangerous goods) certificate (ISO 8601 date)',
    example: '2026-11-30',
    format: 'date',
    nullable: true,
    type: String,
  })
  @Column({ name: 'adr_valid_until', type: 'date', nullable: true })
  adrValidUntil: Date | null;

  @ApiPropertyOptional({
    description: 'Date on which the driver was hired by the company (ISO 8601 date)',
    example: '2021-04-01',
    format: 'date',
    nullable: true,
    type: String,
  })
  @Column({ name: 'hired_at', type: 'date', nullable: true })
  hiredAt: Date | null;

  @ApiPropertyOptional({
    description: 'Fixed monthly salary amount for this driver',
    example: 2400.00,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'monthly_salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlySalary: number | null;

  @ApiPropertyOptional({
    description: 'Currency in which the fixed monthly salary is defined',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    nullable: true,
  })
  @Column({
    name: 'salary_currency',
    type: 'enum',
    enum: Currency,
    enumName: 'driver_salary_currency_enum',
    nullable: true,
  })
  salaryCurrency: Currency | null;

  @ApiPropertyOptional({
    description: 'Free-text notes or remarks about the driver (e.g. restrictions, preferences)',
    example: 'Prefers long-haul routes. No night shifts requested.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description: 'Soft-delete flag — when false the driver is deactivated and excluded from active operations',
    example: true,
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // ─── Relations ──────────────────────────────────────
  @OneToMany(() => DispatchAssignment, (assignment) => assignment.driver)
  assignments: DispatchAssignment[];

  @OneToMany(() => Document, (doc) => doc.driver)
  documents: Document[];
}
