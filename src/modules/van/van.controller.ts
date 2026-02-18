import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { VanService } from './van.service';
import { CreateVanDto } from './dto/create-van.dto';
import { UpdateVanDto } from './dto/update-van.dto';
import { Van } from './entities/van.entity';

@ApiTags('Vans')
@ApiExtraModels(Van, CreateVanDto, UpdateVanDto)
@Controller('vans')
export class VanController {
  constructor(private readonly vanService: VanService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new van',
    description:
      'Creates a new van record in the fleet. The license plate must be unique across all vans. ' +
      'Only the cargo dimensions and max weight are required; all vehicle-info fields are optional.',
  })
  @ApiBody({ type: CreateVanDto })
  @ApiResponse({
    status: 201,
    description: 'Van created successfully. Returns the persisted van entity.',
    type: Van,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed – one or more request body fields are invalid.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict – a van with the provided license plate already exists.',
  })
  create(@Body() dto: CreateVanDto) {
    return this.vanService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all vans',
    description:
      'Returns all van records in the fleet ordered alphabetically by name. ' +
      'Includes vans in every status (AVAILABLE, ON_ROUTE, MAINTENANCE, OUT_OF_SERVICE).',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of all van entities, sorted by name ascending.',
    type: Van,
    isArray: true,
  })
  findAll() {
    return this.vanService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'List available vans',
    description:
      'Returns only vans whose status is AVAILABLE – i.e. vans that are not currently ' +
      'assigned to a route, not under maintenance, and not out of service. ' +
      'Use this endpoint when selecting a van for a new dispatch assignment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of van entities with status AVAILABLE.',
    type: Van,
    isArray: true,
  })
  findAvailable() {
    return this.vanService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single van by ID',
    description:
      'Retrieves a van by its UUID, including its active dispatch assignments. ' +
      'Returns 404 when no van with the given ID exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier of the van',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The van entity with its related assignments.',
    type: Van,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request – the provided id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found – no van exists with the given ID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vanService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a van',
    description:
      'Partially or fully updates an existing van. All body fields are optional; ' +
      'only the fields provided will be changed. Returns the updated van entity.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier of the van to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiBody({ type: UpdateVanDto })
  @ApiResponse({
    status: 200,
    description: 'Van updated successfully. Returns the full updated van entity.',
    type: Van,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed – one or more request body fields are invalid, or the id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found – no van exists with the given ID.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict – the new license plate is already used by another van.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVanDto,
  ) {
    return this.vanService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a van',
    description:
      'Permanently removes a van from the fleet. This action cannot be undone. ' +
      'Ensure the van has no active dispatch assignments before deleting.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 identifier of the van to delete',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Van deleted successfully. No content is returned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request – the provided id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found – no van exists with the given ID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vanService.remove(id);
  }
}
