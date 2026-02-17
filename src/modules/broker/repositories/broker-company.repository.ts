import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BrokerCompany } from '../entities/broker-company.entity';

@Injectable()
export class BrokerCompanyRepository extends Repository<BrokerCompany> {
  constructor(private dataSource: DataSource) {
    super(BrokerCompany, dataSource.createEntityManager());
  }

  async findWithRelations(id: string): Promise<BrokerCompany | null> {
    return this.findOne({
      where: { id },
      relations: ['contacts', 'trustProfile'],
    });
  }

  async findAllActive(): Promise<BrokerCompany[]> {
    return this.find({
      where: { isActive: true },
      relations: ['trustProfile'],
      order: { companyName: 'ASC' },
    });
  }

  async findByTaxId(taxId: string): Promise<BrokerCompany | null> {
    return this.findOne({ where: { taxId } });
  }

  async searchByName(query: string): Promise<BrokerCompany[]> {
    return this.createQueryBuilder('broker')
      .where('broker.companyName ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('broker.trustProfile', 'trust')
      .orderBy('broker.companyName', 'ASC')
      .getMany();
  }
}
