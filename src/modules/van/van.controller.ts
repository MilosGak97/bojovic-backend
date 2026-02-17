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
import { VanService } from './van.service';
import { CreateVanDto } from './dto/create-van.dto';
import { UpdateVanDto } from './dto/update-van.dto';

@Controller('vans')
export class VanController {
  constructor(private readonly vanService: VanService) {}

  @Post()
  create(@Body() dto: CreateVanDto) {
    return this.vanService.create(dto);
  }

  @Get()
  findAll() {
    return this.vanService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.vanService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vanService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVanDto,
  ) {
    return this.vanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vanService.remove(id);
  }
}
