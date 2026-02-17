import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Van } from '../entities/van.entity';
import { VanStatus } from '../../../common/enums';

@Injectable()
export class VanRepository extends Repository<Van> {
  constructor(private dataSource: DataSource) {
    super(Van, dataSource.createEntityManager());
  }

  async findAvailable(): Promise<Van[]> {
    return this.find({
      where: { status: VanStatus.AVAILABLE },
      order: { name: 'ASC' },
    });
  }

  async findWithAssignments(id: string): Promise<Van | null> {
    return this.findOne({
      where: { id },
      relations: ['assignments', 'routes'],
    });
  }
}
