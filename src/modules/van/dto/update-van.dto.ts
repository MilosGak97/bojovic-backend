import { PartialType } from '@nestjs/mapped-types';
import { CreateVanDto } from './create-van.dto';

export class UpdateVanDto extends PartialType(CreateVanDto) {}
