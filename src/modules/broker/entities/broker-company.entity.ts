import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerContact } from './broker-contact.entity';
import { BrokerTrustProfile } from './broker-trust-profile.entity';
import { Load } from '../../load/entities/load.entity';
import { PaymentRecord } from '../../payment/entities/payment-record.entity';
import { Document } from '../../document/entities/document.entity';

@Entity('broker_companies')
@Index('IDX_broker_company_tax_id', ['taxId'], { unique: true })
@Index('IDX_broker_company_name', ['companyName'])
@Index('IDX_broker_company_country', ['country'])
export class BrokerCompany extends BaseEntity {
  @ApiProperty({
    description: 'Trading name of the broker company as used in day-to-day operations',
    example: 'Müller Logistik GmbH',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @ApiPropertyOptional({
    description: 'Official registered legal name of the company, if different from the trading name',
    example: 'Müller Logistik Gesellschaft mit beschränkter Haftung',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'legal_name', type: 'varchar', length: 255, nullable: true })
  legalName: string | null;

  @ApiProperty({
    description: 'National tax identification number (e.g. Steuernummer in Germany, NIP in Poland). Must be unique across all broker companies.',
    example: 'DE-123456789',
    maxLength: 50,
    type: String,
  })
  @Column({ name: 'tax_id', length: 50 })
  taxId: string;

  @ApiPropertyOptional({
    description: 'EU VAT identification number used for cross-border invoicing within the European Union',
    example: 'DE123456789',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'vat_id', type: 'varchar', length: 50, nullable: true })
  vatId: string | null;

  @ApiProperty({
    description: 'Street address including house or building number of the company headquarters',
    example: 'Frankfurter Allee 120',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'street', length: 255 })
  street: string;

  @ApiProperty({
    description: 'City where the company headquarters is located',
    example: 'Berlin',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'city', length: 100 })
  city: string;

  @ApiProperty({
    description: 'Postal / ZIP code of the company headquarters',
    example: '10247',
    maxLength: 20,
    type: String,
  })
  @Column({ name: 'postcode', length: 20 })
  postcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the company headquarters',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @Column({ name: 'country', length: 5 })
  country: string;

  @ApiPropertyOptional({
    description: 'Approximate number of employees in the broker company',
    example: 42,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'employee_count', type: 'int', nullable: true })
  employeeCount: number | null;

  @ApiPropertyOptional({
    description: 'Main office phone number including international dialling code',
    example: '+49 30 12345678',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'General company e-mail address used for business correspondence',
    example: 'info@mueller-logistik.de',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://www.mueller-logistik.de',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @ApiPropertyOptional({
    description: 'Broker identifier on the Trans.eu freight exchange platform',
    example: 'TRANS-EU-98765',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'trans_eu_id', type: 'varchar', length: 100, nullable: true })
  transEuId: string | null;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of invoices/loads paid on time',
    example: 974,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'trans_eu_paid_on_time', type: 'int', nullable: true })
  transEuPaidOnTime: number | null;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of invoices/loads paid with delay',
    example: 0,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'trans_eu_paid_with_delay', type: 'int', nullable: true })
  transEuPaidWithDelay: number | null;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of payment issues/disputes',
    example: 3,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'trans_eu_payment_issues', type: 'int', nullable: true })
  transEuPaymentIssues: number | null;

  @ApiPropertyOptional({
    description: 'Trans.eu rating value (stored as string to preserve display formats such as "5,0")',
    example: '5,0',
    nullable: true,
    type: String,
  })
  @Column({ name: 'trans_eu_rating', type: 'varchar', length: 20, nullable: true })
  transEuRating: string | null;

  @ApiPropertyOptional({
    description: 'Trans.eu number of reviews used for current profile rating',
    example: 1014,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'trans_eu_review_count', type: 'int', nullable: true })
  transEuReviewCount: number | null;

  @ApiPropertyOptional({
    description: 'Maximum cargo insurance coverage amount in EUR',
    example: 100000.00,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'insurance_coverage', type: 'decimal', precision: 12, scale: 2, nullable: true })
  insuranceCoverage: number | null;

  @ApiPropertyOptional({
    description: 'Name of the insurance company providing the cargo liability coverage',
    example: 'Allianz SE',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'insurance_provider', type: 'varchar', length: 255, nullable: true })
  insuranceProvider: string | null;

  @ApiPropertyOptional({
    description: 'Date until which the cargo insurance policy is valid (ISO 8601 date)',
    example: '2025-12-31',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'insurance_valid_until', type: 'date', nullable: true })
  insuranceValidUntil: Date | null;

  @ApiPropertyOptional({
    description: 'Freight broker operating licence number issued by the relevant national authority',
    example: 'LIC-DE-2024-004521',
    maxLength: 100,
    nullable: true,
    type: String,
  })
  @Column({ name: 'license_number', type: 'varchar', length: 100, nullable: true })
  licenseNumber: string | null;

  @ApiPropertyOptional({
    description: 'Expiry date of the operating licence (ISO 8601 date)',
    example: '2026-06-30',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'license_valid_until', type: 'date', nullable: true })
  licenseValidUntil: Date | null;

  @ApiPropertyOptional({
    description: 'Date when the broker was first registered on this platform (ISO 8601 date)',
    example: '2022-03-15',
    nullable: true,
    type: String,
    format: 'date',
  })
  @Column({ name: 'platform_member_since', type: 'date', nullable: true })
  platformMemberSince: Date | null;

  @ApiPropertyOptional({
    description: 'Free-text internal notes about the broker company visible only to platform operators',
    example: 'Reliable partner since 2022. Preferred for DE-PL lanes.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description: 'Whether this broker company is currently active and can be assigned to loads',
    example: true,
    default: true,
    type: Boolean,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // ─── Relations ──────────────────────────────────────
  @OneToMany(() => BrokerContact, (contact) => contact.company, { cascade: true })
  contacts: BrokerContact[];

  @OneToOne(() => BrokerTrustProfile, (profile) => profile.company, { cascade: true })
  trustProfile: BrokerTrustProfile;

  @OneToMany(() => Load, (load) => load.broker)
  loads: Load[];

  @OneToMany(() => PaymentRecord, (payment) => payment.broker)
  payments: PaymentRecord[];

  @OneToMany(() => Document, (doc) => doc.broker)
  documents: Document[];
}
