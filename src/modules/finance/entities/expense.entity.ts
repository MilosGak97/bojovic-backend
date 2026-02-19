import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from '../../load/entities/load.entity';
import { Van } from '../../van/entities/van.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Currency, ExpenseCategory, ExpenseType } from '../../../common/enums';

@Entity('expenses')
@Index('IDX_expense_van', ['vanId'])
@Index('IDX_expense_driver', ['driverId'])
@Index('IDX_expense_load', ['loadId'])
@Index('IDX_expense_category', ['category'])
@Index('IDX_expense_type', ['expenseType'])
@Index('IDX_expense_date', ['expenseDate'])
@Index('IDX_expense_recurring', ['isRecurring'])
export class Expense extends BaseEntity {
  @ApiProperty({
    description: 'Accounting category of the expense',
    example: ExpenseCategory.FUEL,
    enum: ExpenseCategory,
    enumName: 'ExpenseCategory',
  })
  @Column({
    name: 'category',
    type: 'enum',
    enum: ExpenseCategory,
    enumName: 'expense_category_enum',
  })
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Expense nature classification (fixed, variable, trip-linked)',
    example: ExpenseType.VARIABLE,
    enum: ExpenseType,
    enumName: 'ExpenseType',
    default: ExpenseType.VARIABLE,
  })
  @Column({
    name: 'expense_type',
    type: 'enum',
    enum: ExpenseType,
    enumName: 'expense_type_enum',
    default: ExpenseType.VARIABLE,
  })
  expenseType: ExpenseType;

  @ApiProperty({
    description: 'Net expense amount without VAT',
    example: 320.50,
    type: Number,
  })
  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Currency of the expense amounts',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @Column({
    name: 'currency',
    type: 'enum',
    enum: Currency,
    enumName: 'expense_currency_enum',
    default: Currency.EUR,
  })
  currency: Currency;

  @ApiPropertyOptional({
    description: 'VAT percentage rate applied to this expense',
    example: 19,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  vatRate: number | null;

  @ApiPropertyOptional({
    description: 'VAT amount for this expense',
    example: 60.90,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'vat_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  vatAmount: number | null;

  @ApiPropertyOptional({
    description: 'Gross amount including VAT',
    example: 381.40,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'total_with_vat', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalWithVat: number | null;

  @ApiProperty({
    description: 'Date when the expense was incurred',
    example: '2026-02-19',
    format: 'date',
    type: String,
  })
  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @ApiPropertyOptional({
    description: 'Short human-readable description of the expense',
    example: 'Diesel at Shell station A3',
    maxLength: 500,
    nullable: true,
    type: String,
  })
  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @ApiPropertyOptional({
    description: 'Optional URL to uploaded receipt or invoice document',
    example: 'https://cdn.example.com/receipts/2026-02-19-fuel-1.pdf',
    maxLength: 1000,
    nullable: true,
    type: String,
  })
  @Column({ name: 'receipt_url', type: 'varchar', length: 1000, nullable: true })
  receiptUrl: string | null;

  @ApiProperty({
    description: 'Marks this expense as recurring template-style cost',
    example: false,
    type: Boolean,
    default: false,
  })
  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @ApiPropertyOptional({
    description: 'Label used to identify recurring expense templates',
    example: 'Monthly Van Insurance',
    maxLength: 200,
    nullable: true,
    type: String,
  })
  @Column({ name: 'recurring_label', type: 'varchar', length: 200, nullable: true })
  recurringLabel: string | null;

  @ApiPropertyOptional({
    description: 'Vendor or supplier for the expense',
    example: 'Shell Deutschland GmbH',
    maxLength: 200,
    nullable: true,
    type: String,
  })
  @Column({ name: 'vendor', type: 'varchar', length: 200, nullable: true })
  vendor: string | null;

  @ApiPropertyOptional({
    description: 'External reference or invoice number',
    example: 'INV-FUEL-2026-00291',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'reference_number', type: 'varchar', length: 100, nullable: true })
  referenceNumber: string | null;

  @ApiPropertyOptional({
    description: 'Internal notes related to this expense',
    example: 'Fuel card #03 used. Route DE-BE.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ApiPropertyOptional({
    description: 'Related vehicle UUID for vehicle-specific expenses',
    example: '0f5eec83-22bd-4a4a-92f3-2c793fca1485',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'van_id', type: 'uuid', nullable: true })
  vanId: string | null;

  @ApiPropertyOptional({
    description: 'Related driver UUID for driver-specific expenses',
    example: '162774fe-bbde-473e-83d4-fe8af867dadf',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string | null;

  @ApiPropertyOptional({
    description: 'Related load UUID for trip-linked expenses',
    example: 'c7d9ffac-4474-4bb4-ab29-cef6d07c26be',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid', nullable: true })
  loadId: string | null;

  @ManyToOne(() => Van, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'van_id' })
  van: Van | null;

  @ManyToOne(() => Driver, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver | null;

  @ManyToOne(() => Load, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'load_id' })
  load: Load | null;
}
