import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaymentRecord } from '../entities/payment-record.entity';
import { PaymentStatus } from '../../../common/enums';
import { BrokerPaymentStatsDto } from '../dto/broker-payment-stats.dto';

@Injectable()
export class PaymentRecordRepository extends Repository<PaymentRecord> {
  constructor(private dataSource: DataSource) {
    super(PaymentRecord, dataSource.createEntityManager());
  }

  async findAllWithRelations(): Promise<PaymentRecord[]> {
    return this.find({
      relations: ['load', 'broker'],
      order: { dueDate: 'ASC', createdAt: 'DESC' },
    });
  }

  async findByLoad(loadId: string): Promise<PaymentRecord[]> {
    return this.find({
      where: { loadId },
      relations: ['broker'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByBroker(brokerId: string): Promise<PaymentRecord[]> {
    return this.find({
      where: { brokerId },
      relations: ['load'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOverdue(): Promise<PaymentRecord[]> {
    return this.createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.PENDING })
      .andWhere('payment.dueDate < NOW()')
      .leftJoinAndSelect('payment.broker', 'broker')
      .leftJoinAndSelect('payment.load', 'load')
      .orderBy('payment.dueDate', 'ASC')
      .getMany();
  }

  async getBrokerPaymentStats(brokerId: string): Promise<BrokerPaymentStatsDto> {
    const result = await this.createQueryBuilder('p')
      .select('COUNT(*)', 'totalLoads')
      .addSelect(
        `COUNT(CASE WHEN p.status = '${PaymentStatus.PAID}' AND (p.paid_date <= p.due_date OR p.days_overdue IS NULL OR p.days_overdue <= 0) THEN 1 END)`,
        'onTimeCount',
      )
      .addSelect(
        `COUNT(CASE WHEN p.status = '${PaymentStatus.PAID}' AND p.days_overdue > 0 THEN 1 END)`,
        'delayedCount',
      )
      .addSelect(
        `COUNT(CASE WHEN p.status IN ('${PaymentStatus.DISPUTED}', '${PaymentStatus.WRITTEN_OFF}') THEN 1 END)`,
        'issuesCount',
      )
      .addSelect('AVG(p.days_overdue)', 'averagePaymentDays')
      .where('p.broker_id = :brokerId', { brokerId })
      .getRawOne();

    return {
      totalLoads: parseInt(result.totalLoads, 10),
      onTimeCount: parseInt(result.onTimeCount, 10),
      delayedCount: parseInt(result.delayedCount, 10),
      issuesCount: parseInt(result.issuesCount, 10),
      averagePaymentDays: result.averagePaymentDays
        ? parseFloat(result.averagePaymentDays)
        : null,
    };
  }
}
