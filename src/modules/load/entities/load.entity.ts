import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from '../../broker/entities/broker-company.entity';
import { BrokerContact } from '../../broker/entities/broker-contact.entity';
import { LoadStop } from './load-stop.entity';
import { LoadFreightDetails } from './load-freight-details.entity';
import { LoadPallet } from './load-pallet.entity';
import { PaymentRecord } from '../../payment/entities/payment-record.entity';
import { Document } from '../../document/entities/document.entity';
import { Van } from '../../van/entities/van.entity';
import { LoadStatus, Currency, LoadBoardSource } from '../../../common/enums';

@Entity('loads')
@Index('IDX_load_reference', ['referenceNumber'], { unique: true })
@Index('IDX_load_status', ['status'])
@Index('IDX_load_broker', ['brokerId'])
@Index('IDX_load_broker_contact', ['brokerContactId'])
@Index('IDX_load_planner_van', ['plannerVanId'])
@Index('IDX_load_pickup_date', ['pickupDateFrom'])
@Index('IDX_load_delivery_date', ['deliveryDateFrom'])
@Index('IDX_load_created', ['createdAt'])
export class Load extends BaseEntity {
  @ApiProperty({
    description: 'Unique human-readable reference number for the load',
    example: 'FR/2026/02/13/CGC0',
    maxLength: 50,
    type: String,
  })
  @Column({ name: 'reference_number', length: 50 })
  referenceNumber: string;

  @ApiPropertyOptional({
    description: 'Optional freight number from Trans.eu for external cross-reference',
    example: 'TE-PL-2026-004512',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'trans_eu_freight_number', type: 'varchar', length: 100, nullable: true })
  transEuFreightNumber: string | null;

  @ApiProperty({
    description: 'Current workflow status of the load',
    example: LoadStatus.PUBLISHED,
    enum: LoadStatus,
    enumName: 'LoadStatus',
  })
  @Column({ name: 'status', type: 'enum', enum: LoadStatus, default: LoadStatus.DRAFT })
  status: LoadStatus;

  @ApiProperty({
    description: 'Source freight board or channel where this load originated',
    example: LoadBoardSource.TRANS_EU,
    enum: LoadBoardSource,
    enumName: 'LoadBoardSource',
  })
  @Column({
    name: 'board_source',
    type: 'enum',
    enum: LoadBoardSource,
    enumName: 'load_board_source_enum',
    default: LoadBoardSource.MANUAL,
  })
  boardSource: LoadBoardSource;

  @ApiPropertyOptional({
    description: 'Hex colour code used for visual grouping in the UI',
    example: '#3B82F6',
    maxLength: 7,
    nullable: true,
    type: String,
  })
  @Column({ name: 'color', type: 'varchar', length: 7, nullable: true })
  color: string | null;

  @ApiPropertyOptional({
    description: 'Display name of the brokerage used in planner-style workflows',
    example: 'Hamburg Logistics GmbH',
    maxLength: 200,
    nullable: true,
    type: String,
  })
  @Column({ name: 'brokerage_name', type: 'varchar', length: 200, nullable: true })
  brokerageName: string | null;

  @ApiPropertyOptional({
    description: 'Optional Transeu link associated with the pickup location',
    example: 'https://transeu.com/offers/12345',
    maxLength: 500,
    nullable: true,
    type: String,
  })
  @Column({ name: 'origin_transeu_link', type: 'varchar', length: 500, nullable: true })
  originTranseuLink: string | null;

  @ApiPropertyOptional({
    description: 'Optional Transeu link associated with the delivery location',
    example: 'https://transeu.com/offers/12345',
    maxLength: 500,
    nullable: true,
    type: String,
  })
  @Column({ name: 'dest_transeu_link', type: 'varchar', length: 500, nullable: true })
  destTranseuLink: string | null;

  @ApiProperty({
    description: 'Planner visibility flag used to hide loads from active boards',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'is_inactive', type: 'boolean', default: false })
  isInactive: boolean;

  // ─── Pickup ─────────────────────────────────────────
  @ApiProperty({
    description: 'Full street address of the pickup location',
    example: 'Industriestrasse 42',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'pickup_address', length: 255 })
  pickupAddress: string;

  @ApiProperty({
    description: 'City of the pickup location',
    example: 'Hamburg',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'pickup_city', length: 100 })
  pickupCity: string;

  @ApiProperty({
    description: 'Postal code of the pickup location',
    example: '20095',
    maxLength: 20,
    type: String,
  })
  @Column({ name: 'pickup_postcode', length: 20 })
  pickupPostcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the pickup location',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @Column({ name: 'pickup_country', length: 5 })
  pickupCountry: string;

  @ApiProperty({
    description: 'Earliest date and time the cargo is available for pickup (UTC)',
    example: '2026-02-20T06:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @Column({ name: 'pickup_date_from', type: 'timestamptz' })
  pickupDateFrom: Date;

  @ApiPropertyOptional({
    description: 'Latest date and time by which pickup must be completed (UTC)',
    example: '2026-02-20T14:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'pickup_date_to', type: 'timestamptz', nullable: true })
  pickupDateTo: Date | null;

  // ─── Delivery ───────────────────────────────────────
  @ApiProperty({
    description: 'Full street address of the delivery location',
    example: 'Rue de la Paix 8',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'delivery_address', length: 255 })
  deliveryAddress: string;

  @ApiProperty({
    description: 'City of the delivery location',
    example: 'Paris',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'delivery_city', length: 100 })
  deliveryCity: string;

  @ApiProperty({
    description: 'Postal code of the delivery location',
    example: '75001',
    maxLength: 20,
    type: String,
  })
  @Column({ name: 'delivery_postcode', length: 20 })
  deliveryPostcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the delivery location',
    example: 'FR',
    maxLength: 5,
    type: String,
  })
  @Column({ name: 'delivery_country', length: 5 })
  deliveryCountry: string;

  @ApiProperty({
    description: 'Earliest date and time the cargo must arrive at delivery (UTC)',
    example: '2026-02-22T07:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @Column({ name: 'delivery_date_from', type: 'timestamptz' })
  deliveryDateFrom: Date;

  @ApiPropertyOptional({
    description: 'Latest deadline for delivery (UTC)',
    example: '2026-02-22T18:00:00.000Z',
    format: 'date-time',
    nullable: true,
    type: String,
  })
  @Column({ name: 'delivery_date_to', type: 'timestamptz', nullable: true })
  deliveryDateTo: Date | null;

  // ─── Pricing ────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Publicly advertised price for the load in the specified currency',
    example: 2800.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'published_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  publishedPrice: number | null;

  @ApiPropertyOptional({
    description: 'Final negotiated price agreed with the carrier in the specified currency',
    example: 2650.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'agreed_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  agreedPrice: number | null;

  @ApiProperty({
    description: 'Currency in which all prices for this load are expressed',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
  })
  @Column({ name: 'currency', type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @ApiPropertyOptional({
    description: 'Number of days after invoice date by which payment is due',
    example: 30,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'payment_term_days', type: 'int', nullable: true })
  paymentTermDays: number | null;

  @ApiProperty({
    description: 'Whether this load uses Invoitix pricing/invoicing check',
    example: false,
    default: false,
    type: Boolean,
  })
  @Column({ name: 'invoitix', type: 'boolean', default: false })
  invoitix: boolean;

  @ApiProperty({
    description: 'Whether this load requires a valuta check',
    example: false,
    default: false,
    type: Boolean,
  })
  @Column({ name: 'valuta_check', type: 'boolean', default: false })
  valutaCheck: boolean;

  @ApiPropertyOptional({
    description: 'Calculated margin (published price minus agreed price) in the load currency',
    example: 150.0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'margin', type: 'decimal', precision: 12, scale: 2, nullable: true })
  margin: number | null;

  @ApiPropertyOptional({
    description: 'Agreed price divided by total distance, expressed as EUR/km',
    example: 1.2567,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'price_per_km', type: 'decimal', precision: 8, scale: 4, nullable: true })
  pricePerKm: number | null;

  // ─── Freight ────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Total route distance in kilometres',
    example: 1087.5,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'distance_km', type: 'decimal', precision: 8, scale: 1, nullable: true })
  distanceKm: number | null;

  @ApiPropertyOptional({
    description: 'Name of the primary contact person for this load',
    example: 'Klaus Müller',
    maxLength: 200,
    nullable: true,
    type: String,
  })
  @Column({ name: 'contact_person', type: 'varchar', length: 200, nullable: true })
  contactPerson: string | null;

  @ApiPropertyOptional({
    description: 'Phone number of the contact person including country code',
    example: '+49 40 123456789',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'contact_phone', type: 'varchar', length: 50, nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({
    description: 'E-mail address of the contact person',
    example: 'dispatch@broker-example.com',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
  contactEmail: string | null;

  @ApiProperty({
    description: 'Whether real-time GPS vehicle monitoring is required for this load',
    example: false,
    type: Boolean,
  })
  @Column({ name: 'vehicle_monitoring_required', type: 'boolean', default: false })
  vehicleMonitoringRequired: boolean;

  @ApiPropertyOptional({
    description: 'Free-text internal notes or special instructions for this load',
    example: 'Fragile goods – handle with care. Notify recipient 2 hours before arrival.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ApiPropertyOptional({
    description: 'UUID of the broker company assigned to this load',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'broker_id', type: 'uuid', nullable: true })
  brokerId: string | null;

  @ApiPropertyOptional({
    description: 'UUID of the broker contact person assigned to this load',
    example: 'b3c5f3ce-cf59-49bc-9cc0-66f929f3e7f8',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'broker_contact_id', type: 'uuid', nullable: true })
  brokerContactId: string | null;

  @ApiPropertyOptional({
    description: 'UUID of the van this load is assigned to in load planner',
    example: '2df1ba90-8458-4fd4-8a57-cf965b5cdb8c',
    format: 'uuid',
    nullable: true,
    type: String,
  })
  @Column({ name: 'planner_van_id', type: 'uuid', nullable: true })
  plannerVanId: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => BrokerCompany, (broker) => broker.loads, { nullable: true })
  @JoinColumn({ name: 'broker_id' })
  broker: BrokerCompany | null;

  @ManyToOne(() => BrokerContact, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broker_contact_id' })
  brokerContact: BrokerContact | null;

  @ManyToOne(() => Van, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'planner_van_id' })
  plannerVan: Van | null;

  @OneToMany(() => LoadStop, (stop) => stop.load, { cascade: true, orphanedRowAction: 'delete' })
  stops: LoadStop[];

  @OneToOne(() => LoadFreightDetails, (details) => details.load, { cascade: true })
  freightDetails: LoadFreightDetails;

  @OneToMany(() => LoadPallet, (pallet) => pallet.load, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  pallets: LoadPallet[];

  @OneToMany(() => PaymentRecord, (payment) => payment.load)
  payments: PaymentRecord[];

  @OneToMany(() => Document, (doc) => doc.load)
  documents: Document[];
}
