import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateRoutePlanDto } from './create-route-plan.dto';

/**
 * All fields from CreateRoutePlanDto made optional.
 * Send only the fields you want to change; omitted fields are left unchanged.
 */
@ApiExtraModels(CreateRoutePlanDto)
export class UpdateRoutePlanDto extends PartialType(CreateRoutePlanDto) {}
