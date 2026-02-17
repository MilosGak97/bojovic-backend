import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Load } from '../../load/entities/load.entity';
import { BrokerCompany } from '../../broker/entities/broker-company.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Van } from '../../van/entities/van.entity';
import { DocumentType, DocumentCategory } from '../../../common/enums';

@Entity('documents')
@Index('IDX_document_type', ['documentType'])
@Index('IDX_document_category', ['category'])
@Index('IDX_document_load', ['loadId'])
@Index('IDX_document_broker', ['brokerId'])
@Index('IDX_document_driver', ['driverId'])
@Index('IDX_document_van', ['vanId'])
export class Document extends BaseEntity {
  @Column({ name: 'document_type', type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @Column({ name: 'category', type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes: number | null;

  @Column({ name: 'document_number', length: 100, nullable: true })
  documentNumber: string | null;

  @Column({ name: 'issued_at', type: 'date', nullable: true })
  issuedAt: Date | null;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Polymorphic references (nullable) ──────────────
  @Column({ name: 'load_id', type: 'uuid', nullable: true })
  loadId: string | null;

  @Column({ name: 'broker_id', type: 'uuid', nullable: true })
  brokerId: string | null;

  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string | null;

  @Column({ name: 'van_id', type: 'uuid', nullable: true })
  vanId: string | null;

  // ─── Relations ──────────────────────────────────────
  @ManyToOne(() => Load, (load) => load.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'load_id' })
  load: Load | null;

  @ManyToOne(() => BrokerCompany, (broker) => broker.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broker_id' })
  broker: BrokerCompany | null;

  @ManyToOne(() => Driver, (driver) => driver.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver | null;

  @ManyToOne(() => Van, (van) => van.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'van_id' })
  van: Van | null;
}
