import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Van } from './entities/van.entity';
import { VanRepository } from './repositories/van.repository';
import { VanService } from './van.service';
import { VanController } from './van.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Van])],
  controllers: [VanController],
  providers: [VanService, VanRepository],
  exports: [VanService, VanRepository],
})
export class VanModule {}
