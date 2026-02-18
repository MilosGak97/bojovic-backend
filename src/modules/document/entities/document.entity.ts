import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description:
      'Classifies the type of document uploaded or attached to the record. ' +
      'Covers standard freight documents such as CMR waybills, invoices, and proof of delivery.',
    example: DocumentType.CMR,
    enum: DocumentType,
    enumName: 'DocumentType',
  })
  @Column({ name: 'document_type', type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({
    description:
      'Groups the document by the entity it belongs to within the system ' +
      '(e.g. a freight load, a driver, or a van).',
    example: DocumentCategory.LOAD,
    enum: DocumentCategory,
    enumName: 'DocumentCategory',
  })
  @Column({ name: 'category', type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

  @ApiProperty({
    description: 'Human-readable title that identifies the document at a glance.',
    example: 'CMR Waybill – Berlin to Warsaw',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'title', length: 255 })
  title: string;

  @ApiProperty({
    description: 'Original file name as it was uploaded, including the file extension.',
    example: 'cmr_waybill_BER-WAW-2024-06-01.pdf',
    maxLength: 255,
    type: String,
  })
  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @ApiProperty({
    description:
      'Relative or absolute storage path where the file is persisted ' +
      '(e.g. an object-storage key or a local filesystem path).',
    example: 'uploads/documents/2024/06/cmr_waybill_BER-WAW-2024-06-01.pdf',
    maxLength: 500,
    type: String,
  })
  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @ApiProperty({
    description: 'IANA media type (MIME type) of the uploaded file.',
    example: 'application/pdf',
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @ApiProperty({
    description: 'Size of the uploaded file measured in bytes. Null when the size is unknown.',
    example: 204800,
    nullable: true,
    type: Number,
  })
  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes: number | null;

  @ApiProperty({
    description:
      'Official reference number printed on the document, such as an invoice number or CMR serial. ' +
      'Null when the document does not carry a dedicated reference number.',
    example: 'INV-2024-00347',
    nullable: true,
    maxLength: 100,
    type: String,
  })
  @Column({ name: 'document_number', type: 'varchar', length: 100, nullable: true })
  documentNumber: string | null;

  @ApiProperty({
    description: 'Calendar date on which the document was officially issued. Null when unknown.',
    example: '2024-06-01',
    nullable: true,
    format: 'date',
    type: String,
  })
  @Column({ name: 'issued_at', type: 'date', nullable: true })
  issuedAt: Date | null;

  @ApiProperty({
    description:
      'Expiry date after which the document is no longer legally valid ' +
      '(e.g. an insurance certificate or ADR licence). Null for documents without an expiry.',
    example: '2025-06-01',
    nullable: true,
    format: 'date',
    type: String,
  })
  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date | null;

  @ApiProperty({
    description:
      'Free-text notes providing additional context or remarks about the document. ' +
      'Null when no supplementary information is required.',
    example: 'Signed by consignee at 14:32. Slight damage noted on pallet #3.',
    nullable: true,
    type: String,
  })
  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  // ─── Polymorphic references (nullable) ──────────────

  @ApiProperty({
    description:
      'UUID of the freight load this document is attached to. ' +
      'Null when the document is not associated with a specific load.',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    nullable: true,
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'load_id', type: 'uuid', nullable: true })
  loadId: string | null;

  @ApiProperty({
    description:
      'UUID of the broker company this document is attached to. ' +
      'Null when the document is not associated with a broker.',
    example: 'c4d5e6f7-a8b9-0123-cdef-456789012bcd',
    nullable: true,
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'broker_id', type: 'uuid', nullable: true })
  brokerId: string | null;

  @ApiProperty({
    description:
      'UUID of the driver this document is attached to. ' +
      'Null when the document is not associated with a specific driver.',
    example: 'd5e6f7a8-b9c0-1234-defa-567890123cde',
    nullable: true,
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string | null;

  @ApiProperty({
    description:
      'UUID of the van or trailer this document is attached to. ' +
      'Null when the document is not associated with a specific vehicle.',
    example: 'e6f7a8b9-c0d1-2345-efab-678901234def',
    nullable: true,
    format: 'uuid',
    type: String,
  })
  @Column({ name: 'van_id', type: 'uuid', nullable: true })
  vanId: string | null;

  // ─── Relations ──────────────────────────────────────

  @ApiProperty({
    description: 'Freight load record this document belongs to. Null when not linked to a load.',
    type: () => Load,
    nullable: true,
  })
  @ManyToOne(() => Load, (load) => load.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'load_id' })
  load: Load | null;

  @ApiProperty({
    description:
      'Broker company record this document belongs to. Null when not linked to a broker.',
    type: () => BrokerCompany,
    nullable: true,
  })
  @ManyToOne(() => BrokerCompany, (broker) => broker.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broker_id' })
  broker: BrokerCompany | null;

  @ApiProperty({
    description: 'Driver record this document belongs to. Null when not linked to a driver.',
    type: () => Driver,
    nullable: true,
  })
  @ManyToOne(() => Driver, (driver) => driver.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver | null;

  @ApiProperty({
    description:
      'Van or trailer record this document belongs to. Null when not linked to a vehicle.',
    type: () => Van,
    nullable: true,
  })
  @ManyToOne(() => Van, (van) => van.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'van_id' })
  van: Van | null;
}
