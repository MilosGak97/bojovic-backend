import { Injectable, NotFoundException } from '@nestjs/common';
import { VanRepository } from './repositories/van.repository';
import { CreateVanDto } from './dto/create-van.dto';
import { UpdateVanDto } from './dto/update-van.dto';
import { Van } from './entities/van.entity';

@Injectable()
export class VanService {
  constructor(private readonly vanRepo: VanRepository) {}

  async create(dto: CreateVanDto): Promise<Van> {
    const van = this.vanRepo.create(dto);
    return this.vanRepo.save(van);
  }

  async findAll(): Promise<Van[]> {
    return this.vanRepo.find({ order: { name: 'ASC' } });
  }

  async findAvailable(): Promise<Van[]> {
    return this.vanRepo.findAvailable();
  }

  async findOne(id: string): Promise<Van> {
    const van = await this.vanRepo.findWithAssignments(id);
    if (!van) throw new NotFoundException(`Van ${id} not found`);
    return van;
  }

  async update(id: string, dto: UpdateVanDto): Promise<Van> {
    await this.findOne(id);
    await this.vanRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const van = await this.findOne(id);
    await this.vanRepo.remove(van);
  }
}
