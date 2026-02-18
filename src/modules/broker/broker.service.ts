import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerCompanyRepository } from './repositories/broker-company.repository';
import { BrokerTrustProfileRepository } from './repositories/broker-trust-profile.repository';
import { CreateBrokerCompanyDto } from './dto/create-broker-company.dto';
import { CreateBrokerContactDto } from './dto/create-broker-contact.dto';
import { UpdateBrokerCompanyDto } from './dto/update-broker-company.dto';
import { BrokerCompany } from './entities/broker-company.entity';
import { BrokerContact } from './entities/broker-contact.entity';

@Injectable()
export class BrokerService {
  constructor(
    private readonly companyRepo: BrokerCompanyRepository,
    private readonly trustRepo: BrokerTrustProfileRepository,
    @InjectRepository(BrokerContact)
    private readonly contactRepo: Repository<BrokerContact>,
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

  async findContacts(companyId: string): Promise<BrokerContact[]> {
    await this.findOne(companyId);
    return this.contactRepo.find({
      where: { companyId },
      order: { isPrimary: 'DESC', lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async createContact(dto: CreateBrokerContactDto): Promise<BrokerContact> {
    await this.findOne(dto.companyId);
    const contact = this.contactRepo.create({
      ...dto,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email?.trim() ?? null,
      phone: dto.phone?.trim() ?? null,
      mobile: dto.mobile?.trim() ?? null,
      notes: dto.notes?.trim() ?? null,
    });
    return this.contactRepo.save(contact);
  }
}
