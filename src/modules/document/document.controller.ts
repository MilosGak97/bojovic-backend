import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { DocumentCategory } from '../../common/enums';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiOperation({
    summary: 'Upload / register a new document',
    description:
      'Creates a new document record in the system and associates it with the target entity ' +
      '(load, broker, driver, or van) identified by the corresponding UUID field. ' +
      'The file itself must be uploaded separately; this endpoint stores the metadata and storage path.',
  })
  @ApiBody({
    type: CreateDocumentDto,
    description: 'Document metadata and storage details.',
    examples: {
      cmr_waybill: {
        summary: 'CMR waybill attached to a load',
        value: {
          documentType: 'CMR',
          category: 'LOAD',
          title: 'CMR Waybill – Berlin to Warsaw',
          fileName: 'cmr_waybill_BER-WAW-2024-06-01.pdf',
          filePath: 'uploads/documents/2024/06/cmr_waybill_BER-WAW-2024-06-01.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 204800,
          documentNumber: 'CMR-2024-00182',
          issuedAt: '2024-06-01',
          loadId: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
        },
      },
      invoice_pdf: {
        summary: 'Invoice PDF attached to a broker',
        value: {
          documentType: 'INVOICE',
          category: 'BROKER',
          title: 'Invoice #INV-2024-00347 – Fast Freight GmbH',
          fileName: 'invoice_INV-2024-00347.pdf',
          filePath: 'uploads/documents/2024/06/invoice_INV-2024-00347.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 98304,
          documentNumber: 'INV-2024-00347',
          issuedAt: '2024-06-15',
          validUntil: '2024-07-15',
          brokerId: 'c4d5e6f7-a8b9-0123-cdef-456789012bcd',
          notes: 'Net-30 payment terms. Bank details on page 2.',
        },
      },
      driver_licence: {
        summary: 'Driver licence attached to a driver',
        value: {
          documentType: 'LICENSE',
          category: 'DRIVER',
          title: 'Category CE Driving Licence – Jan Kowalski',
          fileName: 'licence_CE_kowalski.pdf',
          filePath: 'uploads/documents/2024/01/licence_CE_kowalski.pdf',
          mimeType: 'application/pdf',
          fileSizeBytes: 512000,
          documentNumber: 'DL-PL-2019-004821',
          issuedAt: '2019-03-14',
          validUntil: '2029-03-14',
          driverId: 'd5e6f7a8-b9c0-1234-defa-567890123cde',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document record created successfully.',
    type: Document,
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. The request body is missing required fields or contains invalid values.',
  })
  create(@Body() dto: CreateDocumentDto) {
    return this.documentService.create(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single document by ID',
    description:
      'Returns the full document record for the given UUID, including all metadata fields ' +
      'and the populated relation for whichever entity category the document belongs to.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 of the document record to retrieve.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Document record found and returned.',
    type: Document,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No document record was found for the given UUID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'List documents for a specific entity',
    description:
      'Returns all document records that belong to the entity identified by the combination of ' +
      'category (e.g. LOAD, DRIVER) and entityId (the UUID of the target record). ' +
      'Results are ordered by creation date descending.',
  })
  @ApiQuery({
    name: 'category',
    description:
      'The entity category the documents belong to. ' +
      'Must be one of the DocumentCategory enum values.',
    enum: DocumentCategory,
    enumName: 'DocumentCategory',
    example: DocumentCategory.LOAD,
    required: true,
  })
  @ApiQuery({
    name: 'entityId',
    description:
      'UUID v4 of the entity whose documents should be listed ' +
      '(e.g. the load ID when category is LOAD).',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    format: 'uuid',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Array of document records belonging to the specified entity. ' +
      'Returns an empty array when no documents are found.',
    type: [Document],
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. entityId is not a valid UUID or category is not a recognised enum value.',
  })
  findByEntity(
    @Query('category') category: DocumentCategory,
    @Query('entityId', ParseUUIDPipe) entityId: string,
  ) {
    return this.documentService.findByEntity(category, entityId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a document by ID',
    description:
      'Permanently removes the document record from the database. ' +
      'The physical file at the stored filePath is not deleted by this endpoint; ' +
      'file removal must be handled separately if required.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 of the document record to delete.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Document record deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No document record was found for the given UUID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentService.remove(id);
  }
}
