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
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { CreateBrokerCompanyDto } from './dto/create-broker-company.dto';
import { UpdateBrokerCompanyDto } from './dto/update-broker-company.dto';

@Controller('brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Post()
  create(@Body() dto: CreateBrokerCompanyDto) {
    return this.brokerService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) return this.brokerService.search(search);
    return this.brokerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brokerService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrokerCompanyDto,
  ) {
    return this.brokerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brokerService.remove(id);
  }
}
