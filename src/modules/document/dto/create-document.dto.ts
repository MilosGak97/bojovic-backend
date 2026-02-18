import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, DocumentCategory } from '../../../common/enums';

export class CreateDocumentDto {
  @ApiProperty({
    description:
      'Classifies the type of document being created. ' +
      'Use CMR for international carriage waybills, INVOICE for billing documents, ' +
      'POD for proof-of-delivery receipts, etc.',
    example: DocumentType.CMR,
    enum: DocumentType,
    enumName: 'DocumentType',
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    description:
      'Indicates which entity category this document belongs to. ' +
      'Must match the entity UUID supplied in the corresponding foreign-key field ' +
      '(loadId, brokerId, driverId, or vanId).',
    example: DocumentCategory.LOAD,
    enum: DocumentCategory,
    enumName: 'DocumentCategory',
  })
  @IsEnum(DocumentCategory)
  category: DocumentCategory;

  @ApiProperty({
    description: 'Human-readable title that describes the document at a glance.',
    example: 'CMR Waybill – Berlin to Warsaw',
    maxLength: 255,
    type: String,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Original file name as uploaded, including the file extension.',
    example: 'cmr_waybill_BER-WAW-2024-06-01.pdf',
    maxLength: 255,
    type: String,
  })
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({
    description:
      'Storage path where the file is persisted. This may be a relative path on the local ' +
      'filesystem or an object-storage key (e.g. an S3 key).',
    example: 'uploads/documents/2024/06/cmr_waybill_BER-WAW-2024-06-01.pdf',
    maxLength: 500,
    type: String,
  })
  @IsString()
  @MaxLength(500)
  filePath: string;

  @ApiProperty({
    description: 'IANA media type (MIME type) of the uploaded file.',
    example: 'application/pdf',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  mimeType: string;

  @ApiPropertyOptional({
    description:
      'Size of the uploaded file measured in bytes. ' +
      'Omit when the size is not known at the time of creation.',
    example: 204800,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @ApiPropertyOptional({
    description:
      'Official reference number printed on the document, ' +
      'such as an invoice number (e.g. INV-2024-00347) or a CMR serial number. ' +
      'Omit when the document does not carry a dedicated reference.',
    example: 'INV-2024-00347',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({
    description:
      'ISO 8601 date string representing the day the document was officially issued. ' +
      'Omit when the issue date is unknown.',
    example: '2024-06-01',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @ApiPropertyOptional({
    description:
      'ISO 8601 date string representing the expiry date of the document. ' +
      'Applicable to time-limited documents such as insurance certificates, ADR licences, or tachograph calibrations. ' +
      'Omit for documents that do not expire.',
    example: '2025-06-01',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({
    description:
      'Free-text notes providing additional context or remarks about the document. ' +
      'Omit when no supplementary information is needed.',
    example: 'Signed by consignee at 14:32. Slight damage noted on pallet #3.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description:
      'UUID of the freight load this document should be attached to. ' +
      'Required when category is LOAD; omit for all other categories.',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  loadId?: string;

  @ApiPropertyOptional({
    description:
      'UUID of the broker company this document should be attached to. ' +
      'Required when category is BROKER; omit for all other categories.',
    example: 'c4d5e6f7-a8b9-0123-cdef-456789012bcd',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @ApiPropertyOptional({
    description:
      'UUID of the driver this document should be attached to. ' +
      'Required when category is DRIVER; omit for all other categories.',
    example: 'd5e6f7a8-b9c0-1234-defa-567890123cde',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({
    description:
      'UUID of the van or trailer this document should be attached to. ' +
      'Required when category is VAN; omit for all other categories.',
    example: 'e6f7a8b9-c0d1-2345-efab-678901234def',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  vanId?: string;
}
