import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentRecordDto) {
    return this.paymentService.create(dto);
  }

  @Get('overdue')
  findOverdue() {
    return this.paymentService.findOverdue();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  findByEntity(
    @Query('loadId') loadId?: string,
    @Query('brokerId') brokerId?: string,
  ) {
    if (loadId) return this.paymentService.findByLoad(loadId);
    if (brokerId) return this.paymentService.findByBroker(brokerId);
    return [];
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentRecordDto,
  ) {
    return this.paymentService.update(id, dto);
  }

  @Patch(':id/paid')
  markPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('paidDate') paidDate?: string,
  ) {
    return this.paymentService.markPaid(id, paidDate);
  }

  @Get('broker/:brokerId/stats')
  getBrokerStats(@Param('brokerId', ParseUUIDPipe) brokerId: string) {
    return this.paymentService.getBrokerStats(brokerId);
  }
}
