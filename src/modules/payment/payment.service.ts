import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRecordRepository } from './repositories/payment-record.repository';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';
import { BrokerPaymentStatsDto } from './dto/broker-payment-stats.dto';
import { PaymentRecord } from './entities/payment-record.entity';
import { PaymentStatus } from '../../common/enums';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRecordRepository) {}

  async create(dto: CreatePaymentRecordDto): Promise<PaymentRecord> {
    const record = this.paymentRepo.create(dto);
    return this.paymentRepo.save(record);
  }

  async findOne(id: string): Promise<PaymentRecord> {
    const record = await this.paymentRepo.findOne({
      where: { id },
      relations: ['load', 'broker'],
    });
    if (!record) throw new NotFoundException(`Payment ${id} not found`);
    return record;
  }

  async findByLoad(loadId: string): Promise<PaymentRecord[]> {
    return this.paymentRepo.findByLoad(loadId);
  }

  async findByBroker(brokerId: string): Promise<PaymentRecord[]> {
    return this.paymentRepo.findByBroker(brokerId);
  }

  async findOverdue(): Promise<PaymentRecord[]> {
    return this.paymentRepo.findOverdue();
  }

  async update(id: string, dto: UpdatePaymentRecordDto): Promise<PaymentRecord> {
    await this.findOne(id);
    await this.paymentRepo.update(id, dto);
    return this.findOne(id);
  }

  async markPaid(id: string, paidDate?: string): Promise<PaymentRecord> {
    await this.findOne(id);
    await this.paymentRepo.update(id, {
      status: PaymentStatus.PAID,
      paidDate: paidDate ? new Date(paidDate) : new Date(),
    });
    return this.findOne(id);
  }

  async getBrokerStats(brokerId: string): Promise<BrokerPaymentStatsDto> {
    return this.paymentRepo.getBrokerPaymentStats(brokerId);
  }
}
