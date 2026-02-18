import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoadStatus } from '../../../common/enums';

export class UpdateLoadStatusDto {
  @ApiProperty({
    description: 'New workflow status to assign to the load',
    enum: LoadStatus,
    enumName: 'LoadStatus',
    example: LoadStatus.IN_TRANSIT,
  })
  @IsEnum(LoadStatus)
  status: LoadStatus;
}
