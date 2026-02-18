import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { DispatchService } from './dispatch.service';
import { CreateDispatchAssignmentDto } from './dto/create-dispatch-assignment.dto';
import { UpdateDispatchAssignmentDto } from './dto/update-dispatch-assignment.dto';
import { UpdateDispatchStatusDto } from './dto/update-dispatch-status.dto';
import { DispatchAssignment } from './entities/dispatch-assignment.entity';

@ApiTags('Dispatch')
@ApiExtraModels(
  CreateDispatchAssignmentDto,
  UpdateDispatchAssignmentDto,
  UpdateDispatchStatusDto,
  DispatchAssignment,
)
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new dispatch assignment',
    description:
      'Creates a new dispatch assignment linking a van, driver, and route plan for a specific date. The assignment starts with a default status of PLANNED unless an explicit status is provided.',
  })
  @ApiBody({ type: CreateDispatchAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'Dispatch assignment successfully created.',
    type: DispatchAssignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more request body fields are invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Referenced van, driver, or route plan does not exist.',
  })
  create(@Body() dto: CreateDispatchAssignmentDto) {
    return this.dispatchService.create(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a dispatch assignment by ID',
    description: 'Returns the full details of a single dispatch assignment identified by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the dispatch assignment to retrieve',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Dispatch assignment found and returned.',
    type: DispatchAssignment,
  })
  @ApiResponse({
    status: 400,
    description: 'The provided id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No dispatch assignment found with the given ID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dispatchService.findOne(id);
  }

  @Get('van/:vanId')
  @ApiOperation({
    summary: 'List all dispatch assignments for a specific van',
    description:
      'Returns all dispatch assignments (past and future) associated with the given van UUID, ordered by assigned date descending.',
  })
  @ApiParam({
    name: 'vanId',
    description: 'UUID of the van whose dispatch assignments should be retrieved',
    example: 'b3c4d5e6-f7a8-4901-bcde-f01234567891',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of dispatch assignments for the specified van (may be empty).',
    type: [DispatchAssignment],
  })
  @ApiResponse({
    status: 400,
    description: 'The provided vanId is not a valid UUID.',
  })
  findByVan(@Param('vanId', ParseUUIDPipe) vanId: string) {
    return this.dispatchService.findByVan(vanId);
  }

  @Get('driver/:driverId')
  @ApiOperation({
    summary: 'List all dispatch assignments for a specific driver',
    description:
      'Returns all dispatch assignments (past and future) associated with the given driver UUID, ordered by assigned date descending.',
  })
  @ApiParam({
    name: 'driverId',
    description: 'UUID of the driver whose dispatch assignments should be retrieved',
    example: 'c4d5e6f7-a8b9-4012-cdef-012345678912',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of dispatch assignments for the specified driver (may be empty).',
    type: [DispatchAssignment],
  })
  @ApiResponse({
    status: 400,
    description: 'The provided driverId is not a valid UUID.',
  })
  findByDriver(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.dispatchService.findByDriver(driverId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Fully update a dispatch assignment',
    description:
      'Replaces all mutable fields of the dispatch assignment with the provided values. All fields in the request body are applied; omit a field to clear it where the column is nullable.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the dispatch assignment to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiBody({ type: UpdateDispatchAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Dispatch assignment successfully updated.',
    type: DispatchAssignment,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more request body fields are invalid, or the ID is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No dispatch assignment found with the given ID.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDispatchAssignmentDto,
  ) {
    return this.dispatchService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update the status of a dispatch assignment',
    description:
      'Transitions the dispatch assignment to a new status. Expected lifecycle: PLANNED -> ASSIGNED -> IN_PROGRESS -> COMPLETED. CANCELED is a terminal state reachable from any status.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the dispatch assignment whose status should be changed',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiBody({ type: UpdateDispatchStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Dispatch assignment status successfully updated.',
    type: DispatchAssignment,
  })
  @ApiResponse({
    status: 400,
    description: 'The provided status value is not a valid DispatchStatus, or the ID is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No dispatch assignment found with the given ID.',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDispatchStatusDto,
  ) {
    return this.dispatchService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a dispatch assignment',
    description:
      'Permanently removes the dispatch assignment record. This action is irreversible. Only assignments that are not in an IN_PROGRESS state should be deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the dispatch assignment to delete',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Dispatch assignment successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'The provided id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No dispatch assignment found with the given ID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.dispatchService.remove(id);
  }
}
