import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from './broker-company.entity';
import { BrokerRiskLevel } from '../../../common/enums';

@Entity('broker_trust_profiles')
@Index('IDX_trust_profile_company', ['companyId'], { unique: true })
@Index('IDX_trust_profile_risk', ['riskLevel'])
export class BrokerTrustProfile extends BaseEntity {
  @ApiProperty({
    description: 'UUID of the broker company this trust profile belongs to (one-to-one relationship)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ApiProperty({
    description: 'Overall risk classification assigned to the broker based on payment history and operational performance',
    example: BrokerRiskLevel.LOW,
    enum: BrokerRiskLevel,
    enumName: 'BrokerRiskLevel',
    default: BrokerRiskLevel.UNRATED,
  })
  @Column({ name: 'risk_level', type: 'enum', enum: BrokerRiskLevel, default: BrokerRiskLevel.UNRATED })
  riskLevel: BrokerRiskLevel;

  @ApiPropertyOptional({
    description: 'Risk score sourced from the Trans.eu platform (0.00 – 100.00, where lower is safer)',
    example: 12.50,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'trans_risk_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  transRiskScore: number | null;

  @ApiProperty({
    description: 'Total number of loads ever assigned to this broker through the platform',
    example: 148,
    default: 0,
    type: Number,
  })
  @Column({ name: 'total_loads', type: 'int', default: 0 })
  totalLoads: number;

  @ApiProperty({
    description: 'Number of loads delivered on time by this broker',
    example: 135,
    default: 0,
    type: Number,
  })
  @Column({ name: 'on_time_count', type: 'int', default: 0 })
  onTimeCount: number;

  @ApiProperty({
    description: 'Number of loads delivered late by this broker',
    example: 10,
    default: 0,
    type: Number,
  })
  @Column({ name: 'delayed_count', type: 'int', default: 0 })
  delayedCount: number;

  @ApiProperty({
    description: 'Number of loads that resulted in a dispute, damage claim, or other operational issue',
    example: 3,
    default: 0,
    type: Number,
  })
  @Column({ name: 'issues_count', type: 'int', default: 0 })
  issuesCount: number;

  @ApiPropertyOptional({
    description: 'Rolling average number of days this broker takes to settle invoices',
    example: 28.5,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'average_payment_days', type: 'decimal', precision: 5, scale: 1, nullable: true })
  averagePaymentDays: number | null;

  @ApiPropertyOptional({
    description: 'Qualitative payment credibility label (e.g. GOOD, AVERAGE, POOR) derived from payment history',
    example: 'GOOD',
    maxLength: 50,
    nullable: true,
    type: String,
  })
  @Column({ name: 'payment_credibility', type: 'varchar', length: 50, nullable: true })
  paymentCredibility: string | null;

  @ApiPropertyOptional({
    description: 'Timestamp of the most recent automated or manual risk evaluation for this broker',
    example: '2024-11-01T09:00:00.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @Column({ name: 'last_evaluated_at', type: 'timestamptz', nullable: true })
  lastEvaluatedAt: Date | null;

  @ApiPropertyOptional({
    description: 'Free-text internal notes about the trust assessment for this broker',
    example: 'Score improved after resolving 2024-Q3 dispute. Monitor payment terms closely.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @OneToOne(() => BrokerCompany, (company) => company.trustProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: BrokerCompany;
}
