import { Injectable, NotFoundException } from '@nestjs/common';
import { BrokerCompanyRepository } from './repositories/broker-company.repository';
import { BrokerTrustProfileRepository } from './repositories/broker-trust-profile.repository';
import { CreateBrokerCompanyDto } from './dto/create-broker-company.dto';
import { UpdateBrokerCompanyDto } from './dto/update-broker-company.dto';
import { BrokerCompany } from './entities/broker-company.entity';

@Injectable()
export class BrokerService {
  constructor(
    private readonly companyRepo: BrokerCompanyRepository,
    private readonly trustRepo: BrokerTrustProfileRepository,
  ) {}

  async create(dto: CreateBrokerCompanyDto): Promise<BrokerCompany> {
    const company = this.companyRepo.create(dto);
    const saved = await this.companyRepo.save(company);

    // Auto-create empty trust profile
    const trust = this.trustRepo.create({ companyId: saved.id });
    await this.trustRepo.save(trust);

    return (await this.companyRepo.findWithRelations(saved.id))!;
  }

  async findAll(): Promise<BrokerCompany[]> {
    return this.companyRepo.findAllActive();
  }

  async findOne(id: string): Promise<BrokerCompany> {
    const company = await this.companyRepo.findWithRelations(id);
    if (!company) throw new NotFoundException(`Broker ${id} not found`);
    return company;
  }

  async update(id: string, dto: UpdateBrokerCompanyDto): Promise<BrokerCompany> {
    await this.findOne(id);
    await this.companyRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepo.remove(company);
  }

  async search(query: string): Promise<BrokerCompany[]> {
    return this.companyRepo.searchByName(query);
  }
}
