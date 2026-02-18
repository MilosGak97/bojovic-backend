import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';

/**
 * All fields from CreateDocumentDto are made optional.
 * Include only the properties you wish to change in the request body;
 * omitted fields will remain unchanged on the persisted document record.
 */
@ApiExtraModels(CreateDocumentDto)
export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
