import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';

/**
 * DTO for updating an existing driver record.
 *
 * All fields from {@link CreateDriverDto} are optional — include only the
 * properties you want to change. Unspecified fields are left unchanged.
 */
@ApiExtraModels(CreateDriverDto)
export class UpdateDriverDto extends PartialType(CreateDriverDto) {}
