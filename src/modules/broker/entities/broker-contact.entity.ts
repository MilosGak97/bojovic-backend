import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from './broker-company.entity';
import { ContactRole } from '../../../common/enums';

@Entity('broker_contacts')
@Index('IDX_broker_contact_company', ['companyId'])
@Index('IDX_broker_contact_email', ['email'])
export class BrokerContact extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the broker company this contact belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ApiProperty({
    description: 'First (given) name of the contact person',
    example: 'Klaus',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'Last (family) name of the contact person',
    example: 'Schreiber',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'Functional role of this contact within the broker organisation',
    example: ContactRole.DISPATCHER,
    enum: ContactRole,
    enumName: 'ContactRole',
    default: ContactRole.DISPATCHER,
  })
  @Column({ name: 'role', type: 'enum', enum: ContactRole, default: ContactRole.DISPATCHER })
  role: ContactRole;

  @ApiPropertyOptional({
    description: 'Direct e-mail address of the contact person',
    example: 'k.schreiber@mueller-logistik.de',
    maxLength: 255,
    nullable: true,
    type: String,
  })
  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @ApiPropertyOptional({
    description: 'Office or direct-dial phone number of the contact person',
    example: '+49 30 12345679',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Mobile / cell phone number of the contact person',
    example: '+49 172 9876543',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'mobile', type: 'varchar', length: 50, nullable: true })
  mobile: string | null;

  @ApiProperty({
    description: 'Indicates whether this is the primary / main contact for the broker company',
    example: false,
    default: false,
    type: Boolean,
  })
  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @ApiPropertyOptional({
    description: 'Free-text internal notes about this contact person',
    example: 'Available Mon-Fri 07:00-18:00 CET. Speaks German, English, Polish.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => BrokerCompany, (company) => company.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: BrokerCompany;
}
