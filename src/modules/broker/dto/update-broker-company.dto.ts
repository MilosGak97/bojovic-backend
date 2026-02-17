import { PartialType } from '@nestjs/mapped-types';
import { CreateBrokerCompanyDto } from './create-broker-company.dto';

export class UpdateBrokerCompanyDto extends PartialType(CreateBrokerCompanyDto) {}
