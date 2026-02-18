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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { RouteService } from './route.service';
import { CreateRoutePlanDto } from './dto/create-route-plan.dto';
import { UpdateRoutePlanDto } from './dto/update-route-plan.dto';
import { CreateRouteSimulationDto } from './dto/create-route-simulation.dto';
import { RoutePlan } from './entities/route-plan.entity';
import { RouteSimulation } from './entities/route-simulation.entity';

@ApiTags('Routes')
@ApiExtraModels(
  CreateRoutePlanDto,
  UpdateRoutePlanDto,
  CreateRouteSimulationDto,
  RoutePlan,
  RouteSimulation,
)
@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @ApiOperation({
    summary: 'Create a new route plan',
    description:
      'Creates a new route plan, optionally pre-populated with an ordered list of stops. ' +
      'The plan is created in DRAFT status by default. Stops can be added inline or separately. ' +
      'Computed totals (distance, fuel, margin) are null until the route is recalculated.',
  })
  @ApiResponse({
    status: 201,
    description: 'Route plan created successfully.',
    type: RoutePlan,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — check the request body for missing or invalid fields.',
  })
  @ApiBody({ type: CreateRoutePlanDto })
  @Post()
  create(@Body() dto: CreateRoutePlanDto) {
    return this.routeService.create(dto);
  }

  @ApiOperation({
    summary: 'Get a route plan by ID',
    description:
      'Returns a single route plan including its stops, assigned van, and any linked simulations. ' +
      'Cached metric totals (distance, fuel cost, margin) are included when available.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the route plan to retrieve',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Route plan found and returned.',
    type: RoutePlan,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Route plan not found.',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.routeService.findOne(id);
  }

  @ApiOperation({
    summary: 'List all route plans for a van',
    description:
      'Returns every route plan (across all statuses: DRAFT, ACTIVE, SIMULATION, ARCHIVED) ' +
      'that is assigned to the specified van, ordered by departure date descending.',
  })
  @ApiParam({
    name: 'vanId',
    description: 'UUID of the van whose route plans should be returned',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of route plans for the van.',
    type: [RoutePlan],
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied vanId is not a valid UUID.',
  })
  @Get('van/:vanId')
  findByVan(@Param('vanId', ParseUUIDPipe) vanId: string) {
    return this.routeService.findByVan(vanId);
  }

  @ApiOperation({
    summary: 'Update a route plan',
    description:
      'Partially updates a route plan. Only the fields included in the request body are changed; ' +
      'all omitted fields retain their current values. ' +
      'Updating stops replaces the full stop list — provide all desired stops in each update. ' +
      'Cached metric totals may become stale and should be recalculated after stop changes.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the route plan to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Route plan updated successfully.',
    type: RoutePlan,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — check the request body.',
  })
  @ApiResponse({
    status: 404,
    description: 'Route plan not found.',
  })
  @ApiBody({ type: UpdateRoutePlanDto })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoutePlanDto,
  ) {
    return this.routeService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a route plan',
    description:
      'Permanently deletes a route plan and all its associated stops (cascade). ' +
      'Any simulations that reference this route as a source are also deleted. ' +
      'This action cannot be undone; consider archiving (status=ARCHIVED) instead.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the route plan to delete',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Route plan deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Route plan not found.',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.routeService.remove(id);
  }

  // ─── Simulation ────────────────────────────────────
  @ApiOperation({
    summary: 'Create a what-if simulation for a route',
    description:
      'Executes the simulation algorithm against the specified source route:\n\n' +
      '1. **Clone** — all stops from the source route are deep-copied into a new RoutePlan with status=SIMULATION.\n' +
      '2. **Modify** — the cloned route can be freely modified (add/remove/reorder stops, add loads) without affecting the live route.\n' +
      '3. **Compute** — distance, driving time, fuel consumption, and margin are calculated for the cloned route.\n' +
      '4. **Delta** — differences vs. the source route are stored on the RouteSimulation record (deltaDistanceKm, deltaTimeMinutes, deltaFuelLiters, deltaMargin).\n' +
      '5. **Warnings** — time-window violations, overweight alerts, and other issues are surfaced in the warnings array.\n\n' +
      'The source route is **never modified** until the simulation is explicitly applied via `POST /simulations/:simulationId/apply`.\n' +
      'If the dispatcher rejects the simulation it can simply be discarded.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the source route plan to simulate against',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Simulation created. Returns the new RouteSimulation record including deltas and warnings.',
    type: RouteSimulation,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — the payload is invalid or id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Source route plan not found.',
  })
  @ApiBody({ type: CreateRouteSimulationDto, required: false })
  @Post(':id/simulate')
  createSimulation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRouteSimulationDto,
  ) {
    return this.routeService.createSimulation(id, dto.name);
  }

  @ApiOperation({
    summary: 'Apply a simulation to its source route',
    description:
      'Applies the simulated route plan to the original source route by swapping their stop lists and recomputing metrics:\n\n' +
      '1. The source route\'s stops are replaced with the simulation\'s stops.\n' +
      '2. Cached totals on the source route (distance, fuel, margin) are updated from the simulation.\n' +
      '3. The RouteSimulation record is marked as `isApplied=true` and `appliedAt` is set to the current timestamp.\n' +
      '4. The simulation RoutePlan (status=SIMULATION) is retained for audit purposes but is now immutable.\n\n' +
      'This operation is **irreversible** — once applied, the original stop order is overwritten. ' +
      'Create a new simulation first if you need to preserve the current live route for comparison.',
  })
  @ApiParam({
    name: 'simulationId',
    description: 'UUID of the RouteSimulation record to apply',
    example: 'f1e2d3c4-b5a6-7890-fedc-ba9876543210',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Simulation applied. Returns the updated source route plan.',
    type: RoutePlan,
  })
  @ApiResponse({
    status: 400,
    description: 'Simulation has already been applied and cannot be applied again.',
  })
  @ApiResponse({
    status: 404,
    description: 'Simulation not found.',
  })
  @Post('simulations/:simulationId/apply')
  applySimulation(@Param('simulationId', ParseUUIDPipe) simulationId: string) {
    return this.routeService.applySimulation(simulationId);
  }

  // ─── Cargo timeline ────────────────────────────────
  @ApiOperation({
    summary: 'Get active load IDs at a specific stop index',
    description:
      'Returns the set of load UUIDs currently on board the van **after** the stop at the given `stopIndex` is completed.\n\n' +
      '**Timeline replay algorithm:**\n' +
      '1. Start with an empty cargo area.\n' +
      '2. Iterate through all route stops ordered by `orderIndex` ascending.\n' +
      '3. For each stop up to and including `stopIndex`:\n' +
      '   - **PICKUP** → add the stop\'s `loadId` to the on-board set.\n' +
      '   - **DELIVERY** → remove the stop\'s `loadId` from the on-board set.\n' +
      '4. Return the resulting set of load IDs.\n\n' +
      'Cargo state is **never stored per stop**; it is always derived on-the-fly from this event replay to ensure a single source of truth. ' +
      'Use this endpoint to power timeline-aware load presence in the dispatcher UI.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the route plan',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'stopIndex',
    description:
      'The zero-based orderIndex of the stop after which the cargo layout should be computed. ' +
      'Pass 0 to see cargo after the first stop, or the total number of stops minus 1 to see the final state.',
    example: 2,
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Array of load UUIDs currently on board after the specified stop index.',
    type: [String],
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID or stopIndex is not a valid integer.',
  })
  @ApiResponse({
    status: 404,
    description: 'Route plan not found.',
  })
  @Get(':id/cargo')
  getCargoAtStop(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('stopIndex', ParseIntPipe) stopIndex: number,
  ) {
    return this.routeService.getCargoAtStop(id, stopIndex);
  }
}
