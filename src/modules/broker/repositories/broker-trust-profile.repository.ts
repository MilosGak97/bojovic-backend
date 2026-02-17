import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BrokerTrustProfile } from '../entities/broker-trust-profile.entity';
import { BrokerRiskLevel } from '../../../common/enums';

@Injectable()
export class BrokerTrustProfileRepository extends Repository<BrokerTrustProfile> {
  constructor(private dataSource: DataSource) {
    super(BrokerTrustProfile, dataSource.createEntityManager());
  }

  async findByCompany(companyId: string): Promise<BrokerTrustProfile | null> {
    return this.findOne({ where: { companyId } });
  }

  async findHighRiskBrokers(): Promise<BrokerTrustProfile[]> {
    return this.find({
      where: [
        { riskLevel: BrokerRiskLevel.HIGH },
        { riskLevel: BrokerRiskLevel.CRITICAL },
      ],
      relations: ['company'],
    });
  }
}
