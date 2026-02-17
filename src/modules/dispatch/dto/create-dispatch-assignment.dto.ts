import { IsUUID, IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { DispatchStatus } from '../../../common/enums';

export class CreateDispatchAssignmentDto {
  @IsUUID()
  vanId: string;

  @IsUUID()
  driverId: string;

  @IsUUID()
  routePlanId: string;

  @IsOptional()
  @IsEnum(DispatchStatus)
  status?: DispatchStatus;

  @IsDateString()
  assignedDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
