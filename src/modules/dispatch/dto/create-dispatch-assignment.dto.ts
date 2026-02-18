import { IsUUID, IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DispatchStatus } from '../../../common/enums';

export class CreateDispatchAssignmentDto {
  @ApiProperty({
    description: 'UUID of the van to assign to this dispatch',
    example: 'b3c4d5e6-f7a8-4901-bcde-f01234567891',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  vanId: string;

  @ApiProperty({
    description: 'UUID of the driver to assign to this dispatch',
    example: 'c4d5e6f7-a8b9-4012-cdef-012345678912',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  driverId: string;

  @ApiProperty({
    description: 'UUID of the route plan this dispatch will execute',
    example: 'd5e6f7a8-b9c0-4123-defa-123456789023',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  routePlanId: string;

  @ApiPropertyOptional({
    description:
      'Initial status for the dispatch assignment. Defaults to PLANNED when omitted. Follows the lifecycle: PLANNED -> ASSIGNED -> IN_PROGRESS -> COMPLETED (or CANCELED)',
    example: DispatchStatus.PLANNED,
    enum: DispatchStatus,
    enumName: 'DispatchStatus',
    default: DispatchStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(DispatchStatus)
  status?: DispatchStatus;

  @ApiProperty({
    description: 'Date on which this dispatch is scheduled to operate (ISO 8601 date string, YYYY-MM-DD)',
    example: '2026-02-17',
    format: 'date',
    type: String,
  })
  @IsDateString()
  assignedDate: string;

  @ApiPropertyOptional({
    description:
      'Optional free-text notes or instructions for the driver or dispatcher (e.g. special handling requirements, customer contact details)',
    example: 'Call the warehouse manager 30 minutes before arrival. Gate code: 4821.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
