import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Currency, DriverPayStatus } from '../../../common/enums';

@Entity('driver_pay_records')
@Index('IDX_driver_pay_driver', ['driverId'])
@Index('IDX_driver_pay_period', ['year', 'month'])
@Index('IDX_driver_pay_status', ['status'])
@Index('UQ_driver_pay_driver_period', ['driverId', 'year', 'month'], { unique: true })
export class DriverPayRecord extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the driver this payroll record belongs to',
    example: '162774fe-bbde-473e-83d4-fe8af867dadf',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'driver_id', type: 'uuid' })
  driverId: string;

  @ApiProperty({
    description: 'Payroll year',
    example: 2026,
    type: Number,
  })
  @Column({ name: 'year', type: 'int' })
  year: number;

  @ApiProperty({
    description: 'Payroll month in range 1-12',
    example: 2,
    type: Number,
  })
  @Column({ name: 'month', type: 'int' })
  month: number;

  @ApiProperty({
    description: 'Base monthly salary component',
    example: 2400,
    type: Number,
  })
  @Column({ name: 'base_salary', type: 'decimal', precision: 10, scale: 2 })
  baseSalary: number;

  @ApiPropertyOptional({
    description: 'Total per-diem amount for the payroll period',
    example: 320,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'per_diem_total', type: 'decimal', precision: 10, scale: 2, nullable: true })
  perDiemTotal: number | null;

  @ApiPropertyOptional({
    description: 'Optional bonus amount for the payroll period',
    example: 150,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'bonus', type: 'decimal', precision: 10, scale: 2, nullable: true })
  bonus: number | null;

  @ApiPropertyOptional({
    description: 'Optional deductions applied to this payroll period',
    example: 80,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'deductions', type: 'decimal', precision: 10, scale: 2, nullable: true })
  deductions: number | null;

  @ApiProperty({
    description: 'Calculated total payout: base + per diem + bonus - deductions',
    example: 2790,
    type: Number,
  })
  @Column({ name: 'total_pay', type: 'decimal', precision: 10, scale: 2 })
  totalPay: number;

  @ApiProperty({
    description: 'Currency in which payroll amounts are expressed',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @Column({
    name: 'currency',
    type: 'enum',
    enum: Currency,
    enumName: 'driver_pay_currency_enum',
    default: Currency.EUR,
  })
  currency: Currency;

  @ApiProperty({
    description: 'Current payroll payment status',
    example: DriverPayStatus.PENDING,
    enum: DriverPayStatus,
    enumName: 'DriverPayStatus',
    default: DriverPayStatus.PENDING,
  })
  @Column({
    name: 'status',
    type: 'enum',
    enum: DriverPayStatus,
    enumName: 'driver_pay_status_enum',
    default: DriverPayStatus.PENDING,
  })
  status: DriverPayStatus;

  @ApiPropertyOptional({
    description: 'Date payroll was paid out',
    example: '2026-03-05',
    format: 'date',
    nullable: true,
    type: String,
  })
  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date | null;

  @ApiPropertyOptional({
    description: 'Additional payroll notes',
    example: 'Includes weekend route bonus.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => Driver, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
