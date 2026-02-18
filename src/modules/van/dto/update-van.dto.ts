import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateVanDto } from './create-van.dto';

/**
 * UpdateVanDto - all fields from CreateVanDto become optional.
 *
 * Swagger property metadata is inherited from CreateVanDto via PartialType.
 * Every field that was required in CreateVanDto is exposed as optional here,
 * and every field that was already optional remains optional.
 */
@ApiExtraModels(CreateVanDto)
export class UpdateVanDto extends PartialType(CreateVanDto) {}
