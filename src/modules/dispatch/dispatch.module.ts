import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchAssignment } from './entities/dispatch-assignment.entity';
import { DispatchAssignmentRepository } from './repositories/dispatch-assignment.repository';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DispatchAssignment])],
  controllers: [DispatchController],
  providers: [DispatchService, DispatchAssignmentRepository],
  exports: [DispatchService, DispatchAssignmentRepository],
})
export class DispatchModule {}
