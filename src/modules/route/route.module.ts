import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutePlan } from './entities/route-plan.entity';
import { RouteStop } from './entities/route-stop.entity';
import { RouteSimulation } from './entities/route-simulation.entity';
import { CargoPlacement } from './entities/cargo-placement.entity';
import { RoutePlanRepository } from './repositories/route-plan.repository';
import { CargoPlacementRepository } from './repositories/cargo-placement.repository';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutePlan, RouteStop, RouteSimulation, CargoPlacement]),
  ],
  controllers: [RouteController],
  providers: [RouteService, RoutePlanRepository, CargoPlacementRepository],
  exports: [RouteService, RoutePlanRepository],
})
export class RouteModule {}
