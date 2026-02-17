import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from './broker-company.entity';
import { ContactRole } from '../../../common/enums';

@Entity('broker_contacts')
@Index('IDX_broker_contact_company', ['companyId'])
@Index('IDX_broker_contact_email', ['email'])
export class BrokerContact extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'role', type: 'enum', enum: ContactRole, default: ContactRole.DISPATCHER })
  role: ContactRole;

  @Column({ name: 'email', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'phone', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'mobile', length: 50, nullable: true })
  mobile: string | null;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => BrokerCompany, (company) => company.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: BrokerCompany;
}
