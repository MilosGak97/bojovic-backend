import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DriverPayRecord } from '../entities/driver-pay-record.entity';
import { DriverPayStatus } from '../../../common/enums';

@Injectable()
export class DriverPayRecordRepository extends Repository<DriverPayRecord> {
  constructor(private dataSource: DataSource) {
    super(DriverPayRecord, dataSource.createEntityManager());
  }

  async findByDriver(driverId: string): Promise<DriverPayRecord[]> {
    return this.find({
      where: { driverId },
      relations: ['driver'],
      order: { year: 'DESC', month: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByPeriod(year: number, month?: number): Promise<DriverPayRecord[]> {
    if (month) {
      return this.find({
        where: { year, month },
        relations: ['driver'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.find({
      where: { year },
      relations: ['driver'],
      order: { month: 'ASC', createdAt: 'ASC' },
    });
  }

  async findPending(): Promise<DriverPayRecord[]> {
    return this.find({
      where: { status: DriverPayStatus.PENDING },
      relations: ['driver'],
      order: { year: 'ASC', month: 'ASC', createdAt: 'ASC' },
    });
  }

  async getTotalSalariesByPeriod(from: string, to: string): Promise<number> {
    const row = await this.createQueryBuilder('pay')
      .select('COALESCE(SUM(pay.totalPay), 0)', 'total')
      .where(
        `make_date(pay.year, pay.month, 1) BETWEEN date_trunc('month', :from::date)::date AND date_trunc('month', :to::date)::date`,
        { from, to },
      )
      .getRawOne<{ total: string }>();

    return Number(row?.total ?? 0);
  }
}
