import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DispatchStatus } from '../../../common/enums';

export class UpdateDispatchStatusDto {
  @ApiProperty({
    description: 'New lifecycle status for the dispatch assignment',
    enum: DispatchStatus,
    enumName: 'DispatchStatus',
    example: DispatchStatus.IN_PROGRESS,
  })
  @IsEnum(DispatchStatus)
  status: DispatchStatus;
}
