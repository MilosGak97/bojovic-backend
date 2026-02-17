import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DispatchAssignment } from '../entities/dispatch-assignment.entity';
import { DispatchStatus } from '../../../common/enums';

@Injectable()
export class DispatchAssignmentRepository extends Repository<DispatchAssignment> {
  constructor(private dataSource: DataSource) {
    super(DispatchAssignment, dataSource.createEntityManager());
  }

  async findWithRelations(id: string): Promise<DispatchAssignment | null> {
    return this.findOne({
      where: { id },
      relations: ['van', 'driver', 'routePlan'],
    });
  }

  async findActiveByVan(vanId: string): Promise<DispatchAssignment[]> {
    return this.find({
      where: [
        { vanId, status: DispatchStatus.PLANNED },
        { vanId, status: DispatchStatus.ASSIGNED },
        { vanId, status: DispatchStatus.IN_PROGRESS },
      ],
      relations: ['driver', 'routePlan'],
      order: { assignedDate: 'ASC' },
    });
  }

  async findActiveByDriver(driverId: string): Promise<DispatchAssignment[]> {
    return this.find({
      where: [
        { driverId, status: DispatchStatus.PLANNED },
        { driverId, status: DispatchStatus.ASSIGNED },
        { driverId, status: DispatchStatus.IN_PROGRESS },
      ],
      relations: ['van', 'routePlan'],
      order: { assignedDate: 'ASC' },
    });
  }
}
