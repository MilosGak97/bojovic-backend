import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { DriverStatus } from '../../../common/enums';

@Injectable()
export class DriverRepository extends Repository<Driver> {
  constructor(private dataSource: DataSource) {
    super(Driver, dataSource.createEntityManager());
  }

  async findAvailable(): Promise<Driver[]> {
    return this.find({
      where: { status: DriverStatus.AVAILABLE, isActive: true },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findWithAssignments(id: string): Promise<Driver | null> {
    return this.findOne({
      where: { id },
      relations: ['assignments'],
    });
  }
}
