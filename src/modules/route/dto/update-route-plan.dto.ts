import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutePlanDto } from './create-route-plan.dto';

export class UpdateRoutePlanDto extends PartialType(CreateRoutePlanDto) {}
