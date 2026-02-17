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
import { DispatchService } from './dispatch.service';
import { CreateDispatchAssignmentDto } from './dto/create-dispatch-assignment.dto';
import { UpdateDispatchAssignmentDto } from './dto/update-dispatch-assignment.dto';
import { DispatchStatus } from '../../common/enums';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  create(@Body() dto: CreateDispatchAssignmentDto) {
    return this.dispatchService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dispatchService.findOne(id);
  }

  @Get('van/:vanId')
  findByVan(@Param('vanId', ParseUUIDPipe) vanId: string) {
    return this.dispatchService.findByVan(vanId);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.dispatchService.findByDriver(driverId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDispatchAssignmentDto,
  ) {
    return this.dispatchService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: DispatchStatus,
  ) {
    return this.dispatchService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.dispatchService.remove(id);
  }
}
