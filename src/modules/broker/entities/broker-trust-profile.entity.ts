import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BrokerCompany } from './broker-company.entity';
import { BrokerRiskLevel } from '../../../common/enums';

@Entity('broker_trust_profiles')
@Index('IDX_trust_profile_company', ['companyId'], { unique: true })
@Index('IDX_trust_profile_risk', ['riskLevel'])
export class BrokerTrustProfile extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'risk_level', type: 'enum', enum: BrokerRiskLevel, default: BrokerRiskLevel.UNRATED })
  riskLevel: BrokerRiskLevel;

  @Column({ name: 'trans_risk_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  transRiskScore: number | null;

  @Column({ name: 'total_loads', type: 'int', default: 0 })
  totalLoads: number;

  @Column({ name: 'on_time_count', type: 'int', default: 0 })
  onTimeCount: number;

  @Column({ name: 'delayed_count', type: 'int', default: 0 })
  delayedCount: number;

  @Column({ name: 'issues_count', type: 'int', default: 0 })
  issuesCount: number;

  @Column({ name: 'average_payment_days', type: 'decimal', precision: 5, scale: 1, nullable: true })
  averagePaymentDays: number | null;

  @Column({ name: 'payment_credibility', length: 50, nullable: true })
  paymentCredibility: string | null;

  @Column({ name: 'last_evaluated_at', type: 'timestamptz', nullable: true })
  lastEvaluatedAt: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Relations ──────────────────────────────────────
  @OneToOne(() => BrokerCompany, (company) => company.trustProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: BrokerCompany;
}
