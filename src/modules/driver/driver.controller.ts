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
} from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@ApiTags('Drivers')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new driver',
    description:
      'Creates a driver record with the supplied details. ' +
      'Only `firstName` and `lastName` are required; all other fields are optional.',
  })
  @ApiBody({ type: CreateDriverDto })
  @ApiResponse({
    status: 201,
    description: 'Driver successfully created. Returns the full driver record.',
    type: Driver,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more request body fields are invalid.',
  })
  create(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all drivers',
    description: 'Returns a list of every driver record stored in the system, regardless of status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of all driver records.',
    type: [Driver],
  })
  findAll() {
    return this.driverService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'Retrieve all available drivers',
    description:
      'Returns only drivers whose status is AVAILABLE, i.e. drivers that can be immediately assigned to a dispatch.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of driver records with status AVAILABLE.',
    type: [Driver],
  })
  findAvailable() {
    return this.driverService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single driver by ID',
    description: 'Returns the full driver record for the given UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 of the driver to retrieve',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver record found and returned.',
    type: Driver,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied `id` is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No driver with the given ID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing driver',
    description:
      'Partially updates the driver identified by the given UUID. ' +
      'Only the supplied fields are changed; omitted fields retain their current values.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 of the driver to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiBody({ type: UpdateDriverDto })
  @ApiResponse({
    status: 200,
    description: 'Driver successfully updated. Returns the updated driver record.',
    type: Driver,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more request body fields are invalid, or `id` is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No driver with the given ID exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a driver',
    description:
      'Permanently removes the driver record identified by the given UUID from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID v4 of the driver to delete',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Driver successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied `id` is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No driver with the given ID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.driverService.remove(id);
  }
}
