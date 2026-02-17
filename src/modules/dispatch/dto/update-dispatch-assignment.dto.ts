import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchAssignmentDto } from './create-dispatch-assignment.dto';

export class UpdateDispatchAssignmentDto extends PartialType(CreateDispatchAssignmentDto) {}
