import { Injectable, NotFoundException } from '@nestjs/common';
import { DispatchAssignmentRepository } from './repositories/dispatch-assignment.repository';
import { CreateDispatchAssignmentDto } from './dto/create-dispatch-assignment.dto';
import { UpdateDispatchAssignmentDto } from './dto/update-dispatch-assignment.dto';
import { DispatchAssignment } from './entities/dispatch-assignment.entity';
import { DispatchStatus } from '../../common/enums';

@Injectable()
export class DispatchService {
  constructor(private readonly assignmentRepo: DispatchAssignmentRepository) {}

  async create(dto: CreateDispatchAssignmentDto): Promise<DispatchAssignment> {
    const assignment = this.assignmentRepo.create(dto);
    const saved = await this.assignmentRepo.save(assignment);
    return (await this.assignmentRepo.findWithRelations(saved.id))!;
  }

  async findOne(id: string): Promise<DispatchAssignment> {
    const assignment = await this.assignmentRepo.findWithRelations(id);
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);
    return assignment;
  }

  async findByVan(vanId: string): Promise<DispatchAssignment[]> {
    return this.assignmentRepo.findActiveByVan(vanId);
  }

  async findByDriver(driverId: string): Promise<DispatchAssignment[]> {
    return this.assignmentRepo.findActiveByDriver(driverId);
  }

  async updateStatus(id: string, status: DispatchStatus): Promise<DispatchAssignment> {
    await this.findOne(id);
    const updates: Partial<DispatchAssignment> = { status };
    if (status === DispatchStatus.IN_PROGRESS) updates.startedAt = new Date();
    if (status === DispatchStatus.COMPLETED) updates.completedAt = new Date();
    await this.assignmentRepo.update(id, updates);
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateDispatchAssignmentDto): Promise<DispatchAssignment> {
    await this.findOne(id);
    await this.assignmentRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}
