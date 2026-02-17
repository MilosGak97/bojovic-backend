import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from './repositories/driver.repository';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepo: DriverRepository) {}

  async create(dto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepo.create(dto);
    return this.driverRepo.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepo.find({
      where: { isActive: true },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findAvailable(): Promise<Driver[]> {
    return this.driverRepo.findAvailable();
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepo.findWithAssignments(id);
    if (!driver) throw new NotFoundException(`Driver ${id} not found`);
    return driver;
  }

  async update(id: string, dto: UpdateDriverDto): Promise<Driver> {
    await this.findOne(id);
    await this.driverRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepo.remove(driver);
  }
}
