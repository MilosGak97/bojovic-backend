import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
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
  @Column({ name: 'load_id', type: 'uuid' })
  loadId: string;

  @Column({ name: 'broker_id', type: 'uuid' })
  brokerId: string;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ name: 'method', type: 'enum', enum: PaymentMethod, nullable: true })
  method: PaymentMethod | null;

  @Column({ name: 'invoice_number', length: 100, nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'currency', type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  vatRate: number | null;

  @Column({ name: 'vat_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  vatAmount: number | null;

  @Column({ name: 'total_with_vat', type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalWithVat: number | null;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: Date | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date | null;

  @Column({ name: 'payment_term_days', type: 'int', nullable: true })
  paymentTermDays: number | null;

  @Column({ name: 'days_overdue', type: 'int', nullable: true })
  daysOverdue: number | null;

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
