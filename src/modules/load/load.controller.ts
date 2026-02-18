import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { LoadService } from './load.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { UpdateLoadStatusDto } from './dto/update-load-status.dto';
import { Load } from './entities/load.entity';
import { LoadStatus } from '../../common/enums';

@ApiTags('Loads')
@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new load',
    description:
      'Creates a new freight load record including optional nested freight details, ' +
      'pallets and intermediate stops. Returns the fully persisted load entity.',
  })
  @ApiBody({ type: CreateLoadDto })
  @ApiResponse({
    status: 201,
    description: 'Load created successfully.',
    type: Load,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error – one or more request body fields are invalid.',
  })
  create(@Body() dto: CreateLoadDto) {
    return this.loadService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all loads',
    description:
      'Returns a paginated list of loads. Results can be filtered by status ' +
      'and/or broker UUID. Use limit and offset for pagination.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: LoadStatus,
    enumName: 'LoadStatus',
    description: 'Filter loads by workflow status.',
    example: LoadStatus.PUBLISHED,
  })
  @ApiQuery({
    name: 'brokerId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter loads assigned to a specific broker company (UUID).',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of loads to return (default determined by service).',
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of loads to skip before returning results (for pagination).',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of loads matching the supplied filters.',
    type: [Load],
  })
  findAll(
    @Query('status') status?: LoadStatus,
    @Query('brokerId') brokerId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.loadService.findAll({ status, brokerId, limit, offset });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single load by ID',
    description:
      'Returns the full load entity including related freight details, pallets, ' +
      'stops, payments and documents.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'UUID of the load to retrieve.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Load found and returned.',
    type: Load,
  })
  @ApiResponse({
    status: 400,
    description: 'Provided ID is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No load found with the supplied ID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.loadService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Replace a load (full update)',
    description:
      'Performs a full replacement of the load record identified by the given UUID. ' +
      'All required fields must be supplied; any omitted optional fields are cleared.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'UUID of the load to replace.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateLoadDto })
  @ApiResponse({
    status: 200,
    description: 'Load replaced successfully.',
    type: Load,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No load found with the supplied ID.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLoadDto,
  ) {
    return this.loadService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update load status',
    description:
      'Transitions the load identified by the given UUID to a new workflow status. ' +
      'Only the status field is updated; all other fields remain unchanged.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'UUID of the load whose status will be changed.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateLoadStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Load status updated successfully.',
    type: Load,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID or status value supplied.',
  })
  @ApiResponse({
    status: 404,
    description: 'No load found with the supplied ID.',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLoadStatusDto,
  ) {
    return this.loadService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a load',
    description:
      'Permanently removes the load identified by the given UUID together with all ' +
      'cascaded child records (stops, freight details, pallets).',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'UUID of the load to delete.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Load deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Provided ID is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No load found with the supplied ID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.loadService.remove(id);
  }
}
