import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRecord } from './entities/payment-record.entity';
import { PaymentRecordRepository } from './repositories/payment-record.repository';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRecord])],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRecordRepository],
  exports: [PaymentService, PaymentRecordRepository],
})
export class PaymentModule {}
