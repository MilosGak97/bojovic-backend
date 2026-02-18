import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from '../../load/entities/load.entity';
import { BrokerCompany } from '../../broker/entities/broker-company.entity';
import { PaymentStatus, PaymentMethod, Currency } from '../../../common/enums';

@Entity('payment_records')
@Index('IDX_payment_load', ['loadId'])
@Index('IDX_payment_broker', ['brokerId'])
@Index('IDX_payment_status', ['status'])
@Index('IDX_payment_due_date', ['dueDate'])
@Index('IDX_payment_invoice', ['invoiceNumber'])
export class PaymentRecord extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the freight load this payment record is associated with',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @ApiProperty({
    description: 'UUID of the broker company responsible for this payment',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'broker_id', type: 'uuid' })
  brokerId: string;

  @ApiProperty({
    description: 'Current billing and settlement state of the payment record',
    example: PaymentStatus.INVOICED,
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    default: PaymentStatus.PENDING,
  })
  @Column({ name: 'status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Method by which the payment is made or expected to be made',
    example: PaymentMethod.BANK_TRANSFER,
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    nullable: true,
    required: false,
  })
  @Column({ name: 'method', type: 'enum', enum: PaymentMethod, nullable: true })
  method: PaymentMethod | null;

  @ApiProperty({
    description: 'Unique invoice reference number issued for this payment',
    example: 'INV-2026-0001',
    maxLength: 100,
    nullable: true,
    required: false,
    type: String,
  })
  @Column({ name: 'invoice_number', type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string | null;

  @ApiProperty({
    description: 'Net invoice amount before VAT, in the specified currency',
    example: 450.00,
    type: Number,
    format: 'decimal',
  })
  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'ISO 4217 currency code for this payment record',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @Column({ name: 'currency', type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @ApiProperty({
    description: 'VAT rate applied to the invoice, expressed as a percentage',
    example: 19.00,
    type: Number,
    format: 'decimal',
    nullable: true,
    required: false,
  })
  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  vatRate: number | null;

  @ApiProperty({
    description: 'Calculated VAT monetary amount based on the net amount and VAT rate',
    example: 85.50,
    type: Number,
    format: 'decimal',
    nullable: true,
    required: false,
  })
  @Column({ name: 'vat_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  vatAmount: number | null;

  @ApiProperty({
    description: 'Total invoice amount including VAT (net amount + VAT amount)',
    example: 535.50,
    type: Number,
    format: 'decimal',
    nullable: true,
    required: false,
  })
  @Column({ name: 'total_with_vat', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalWithVat: number | null;

  @ApiProperty({
    description: 'Date on which the invoice was issued to the broker',
    example: '2026-01-15',
    type: String,
    format: 'date',
    nullable: true,
    required: false,
  })
  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date | null;

  @ApiProperty({
    description: 'Date by which the payment must be received (calculated from issue date and payment term)',
    example: '2026-03-16',
    type: String,
    format: 'date',
    nullable: true,
    required: false,
  })
  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date | null;

  @ApiProperty({
    description: 'Date on which the payment was actually received and confirmed',
    example: '2026-03-10',
    type: String,
    format: 'date',
    nullable: true,
    required: false,
  })
  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date | null;

  @ApiProperty({
    description: 'Agreed payment term expressed as the number of days from the invoice issue date until payment is due',
    example: 60,
    type: Number,
    nullable: true,
    required: false,
  })
  @Column({ name: 'payment_term_days', type: 'int', nullable: true })
  paymentTermDays: number | null;

  @ApiProperty({
    description: 'Number of calendar days the payment is past its due date; null if not yet overdue',
    example: 14,
    type: Number,
    nullable: true,
    required: false,
  })
  @Column({ name: 'days_overdue', type: 'int', nullable: true })
  daysOverdue: number | null;

  @ApiProperty({
    description: 'Free-text notes or remarks about this payment record (e.g. dispute details, special instructions)',
    example: 'Broker requested payment split into two instalments. First instalment due 2026-02-15.',
    type: String,
    nullable: true,
    required: false,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'load_id' })
  load: Load;

  @ManyToOne(() => BrokerCompany, (broker) => broker.payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'broker_id' })
  broker: BrokerCompany;
}
