import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Load } from './entities/load.entity';
import { LoadStop } from './entities/load-stop.entity';
import { LoadFreightDetails } from './entities/load-freight-details.entity';
import { LoadPallet } from './entities/load-pallet.entity';
import { LoadRepository } from './repositories/load.repository';
import { LoadService } from './load.service';
import { LoadController } from './load.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Load, LoadStop, LoadFreightDetails, LoadPallet]),
  ],
  controllers: [LoadController],
  providers: [LoadService, LoadRepository],
  exports: [LoadService, LoadRepository],
})
export class LoadModule {}
