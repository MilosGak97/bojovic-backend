import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { LoadModule } from '../load/load.module';
import { Expense } from './entities/expense.entity';
import { DriverPayRecord } from './entities/driver-pay-record.entity';
import { ExpenseRepository } from './repositories/expense.repository';
import { DriverPayRecordRepository } from './repositories/driver-pay-record.repository';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, DriverPayRecord]),
    PaymentModule,
    LoadModule,
  ],
  controllers: [FinanceController],
  providers: [FinanceService, ExpenseRepository, DriverPayRecordRepository],
  exports: [FinanceService],
})
export class FinanceModule {}
