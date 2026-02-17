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
import { LoadService } from './load.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadStatus } from '../../common/enums';

@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @Post()
  create(@Body() dto: CreateLoadDto) {
    return this.loadService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: LoadStatus,
    @Query('brokerId') brokerId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.loadService.findAll({ status, brokerId, limit, offset });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.loadService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLoadDto,
  ) {
    return this.loadService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: LoadStatus,
  ) {
    return this.loadService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.loadService.remove(id);
  }
}
