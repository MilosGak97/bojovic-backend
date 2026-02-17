import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
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
  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ name: 'legal_name', length: 255, nullable: true })
  legalName: string | null;

  @Column({ name: 'tax_id', length: 50 })
  taxId: string;

  @Column({ name: 'vat_id', length: 50, nullable: true })
  vatId: string | null;

  @Column({ name: 'street', length: 255 })
  street: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'postcode', length: 20 })
  postcode: string;

  @Column({ name: 'country', length: 5 })
  country: string;

  @Column({ name: 'phone', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'email', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'website', length: 255, nullable: true })
  website: string | null;

  @Column({ name: 'trans_eu_id', length: 100, nullable: true })
  transEuId: string | null;

  @Column({ name: 'insurance_coverage', type: 'decimal', precision: 12, scale: 2, nullable: true })
  insuranceCoverage: number | null;

  @Column({ name: 'insurance_provider', length: 255, nullable: true })
  insuranceProvider: string | null;

  @Column({ name: 'insurance_valid_until', type: 'date', nullable: true })
  insuranceValidUntil: Date | null;

  @Column({ name: 'license_number', length: 100, nullable: true })
  licenseNumber: string | null;

  @Column({ name: 'license_valid_until', type: 'date', nullable: true })
  licenseValidUntil: Date | null;

  @Column({ name: 'platform_member_since', type: 'date', nullable: true })
  platformMemberSince: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

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
