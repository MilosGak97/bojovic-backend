import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRoutePlanDto } from './dto/create-route-plan.dto';
import { UpdateRoutePlanDto } from './dto/update-route-plan.dto';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  create(@Body() dto: CreateRoutePlanDto) {
    return this.routeService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.routeService.findOne(id);
  }

  @Get('van/:vanId')
  findByVan(@Param('vanId', ParseUUIDPipe) vanId: string) {
    return this.routeService.findByVan(vanId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoutePlanDto,
  ) {
    return this.routeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.routeService.remove(id);
  }

  // ─── Simulation ────────────────────────────────────
  @Post(':id/simulate')
  createSimulation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('name') name?: string,
  ) {
    return this.routeService.createSimulation(id, name);
  }

  @Post('simulations/:simulationId/apply')
  applySimulation(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.routeService.applySimulation(simulationId);
  }

  // ─── Cargo timeline ────────────────────────────────
  @Get(':id/cargo')
  getCargoAtStop(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('stopIndex', ParseIntPipe) stopIndex: number,
  ) {
    return this.routeService.getCargoAtStop(id, stopIndex);
  }
}
