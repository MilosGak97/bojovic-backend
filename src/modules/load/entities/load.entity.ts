import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from '../../broker/entities/broker-company.entity';
import { LoadStop } from './load-stop.entity';
import { LoadFreightDetails } from './load-freight-details.entity';
import { LoadPallet } from './load-pallet.entity';
import { PaymentRecord } from '../../payment/entities/payment-record.entity';
import { Document } from '../../document/entities/document.entity';
import { LoadStatus, Currency } from '../../../common/enums';

@Entity('loads')
@Index('IDX_load_reference', ['referenceNumber'], { unique: true })
@Index('IDX_load_status', ['status'])
@Index('IDX_load_broker', ['brokerId'])
@Index('IDX_load_pickup_date', ['pickupDateFrom'])
@Index('IDX_load_delivery_date', ['deliveryDateFrom'])
@Index('IDX_load_created', ['createdAt'])
export class Load extends BaseEntity {
  @Column({ name: 'reference_number', length: 50 })
  referenceNumber: string;

  @Column({ name: 'external_id', length: 100, nullable: true })
  externalId: string | null;

  @Column({ name: 'status', type: 'enum', enum: LoadStatus, default: LoadStatus.DRAFT })
  status: LoadStatus;

  @Column({ name: 'color', length: 7, nullable: true })
  color: string | null;

  // ─── Pickup ─────────────────────────────────────────
  @Column({ name: 'pickup_address', length: 255 })
  pickupAddress: string;

  @Column({ name: 'pickup_city', length: 100 })
  pickupCity: string;

  @Column({ name: 'pickup_postcode', length: 20 })
  pickupPostcode: string;

  @Column({ name: 'pickup_country', length: 5 })
  pickupCountry: string;

  @Column({ name: 'pickup_date_from', type: 'timestamptz' })
  pickupDateFrom: Date;

  @Column({ name: 'pickup_date_to', type: 'timestamptz', nullable: true })
  pickupDateTo: Date | null;

  // ─── Delivery ───────────────────────────────────────
  @Column({ name: 'delivery_address', length: 255 })
  deliveryAddress: string;

  @Column({ name: 'delivery_city', length: 100 })
  deliveryCity: string;

  @Column({ name: 'delivery_postcode', length: 20 })
  deliveryPostcode: string;

  @Column({ name: 'delivery_country', length: 5 })
  deliveryCountry: string;

  @Column({ name: 'delivery_date_from', type: 'timestamptz' })
  deliveryDateFrom: Date;

  @Column({ name: 'delivery_date_to', type: 'timestamptz', nullable: true })
  deliveryDateTo: Date | null;

  // ─── Pricing ────────────────────────────────────────
  @Column({ name: 'published_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  publishedPrice: number | null;

  @Column({ name: 'agreed_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  agreedPrice: number | null;

  @Column({ name: 'currency', type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @Column({ name: 'payment_term_days', type: 'int', nullable: true })
  paymentTermDays: number | null;

  @Column({ name: 'margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  margin: number | null;

  @Column({ name: 'price_per_km', type: 'decimal', precision: 8, scale: 4, nullable: true })
  pricePerKm: number | null;

  // ─── Freight ────────────────────────────────────────
  @Column({ name: 'distance_km', type: 'decimal', precision: 8, scale: 1, nullable: true })
  distanceKm: number | null;

  @Column({ name: 'contact_person', length: 200, nullable: true })
  contactPerson: string | null;

  @Column({ name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'vehicle_monitoring_required', type: 'boolean', default: false })
  vehicleMonitoringRequired: boolean;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'broker_id', type: 'uuid', nullable: true })
  brokerId: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => BrokerCompany, (broker) => broker.loads, { nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker: BrokerCompany | null;

  @OneToMany(() => LoadStop, (stop) => stop.load, { cascade: true })
  stops: LoadStop[];

  @OneToOne(() => LoadFreightDetails, (details) => details.load, { cascade: true })
  freightDetails: LoadFreightDetails;

  @OneToMany(() => LoadPallet, (pallet) => pallet.load, { cascade: true })
  pallets: LoadPallet[];

  @OneToMany(() => PaymentRecord, (payment) => payment.load)
  payments: PaymentRecord[];

  @OneToMany(() => Document, (doc) => doc.load)
  documents: Document[];
}
