import { PartialType } from '@nestjs/swagger';
import { CreateDriverPayRecordDto } from './create-driver-pay-record.dto';

export class UpdateDriverPayRecordDto extends PartialType(CreateDriverPayRecordDto) {}
