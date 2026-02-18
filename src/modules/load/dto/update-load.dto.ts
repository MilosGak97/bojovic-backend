import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateLoadDto } from './create-load.dto';

/**
 * All fields of CreateLoadDto become optional.
 * Using PartialType from @nestjs/swagger ensures Swagger reflects the
 * optional nature of every field without duplicating decorator definitions.
 */
@ApiExtraModels(CreateLoadDto)
export class UpdateLoadDto extends PartialType(CreateLoadDto) {}
