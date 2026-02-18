import { PartialType } from '@nestjs/swagger';
import { ApiSchema } from '@nestjs/swagger';
import { CreateBrokerCompanyDto } from './create-broker-company.dto';

@ApiSchema({
  description:
    'Partial update payload for a broker company. All fields from CreateBrokerCompanyDto are optional — supply only the fields you wish to change.',
})
export class UpdateBrokerCompanyDto extends PartialType(CreateBrokerCompanyDto) {}
