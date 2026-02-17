import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerCompany } from './entities/broker-company.entity';
import { BrokerContact } from './entities/broker-contact.entity';
import { BrokerTrustProfile } from './entities/broker-trust-profile.entity';
import { BrokerCompanyRepository } from './repositories/broker-company.repository';
import { BrokerTrustProfileRepository } from './repositories/broker-trust-profile.repository';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrokerCompany, BrokerContact, BrokerTrustProfile]),
  ],
  controllers: [BrokerController],
  providers: [BrokerService, BrokerCompanyRepository, BrokerTrustProfileRepository],
  exports: [BrokerService, BrokerCompanyRepository],
})
export class BrokerModule {}
