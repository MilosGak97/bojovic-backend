import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateDispatchAssignmentDto } from './create-dispatch-assignment.dto';

/**
 * DTO for updating an existing dispatch assignment.
 *
 * All fields from CreateDispatchAssignmentDto are optional — only the provided
 * fields will be updated; omitted fields remain unchanged.
 */
@ApiExtraModels(CreateDispatchAssignmentDto)
export class UpdateDispatchAssignmentDto extends PartialType(CreateDispatchAssignmentDto) {}
