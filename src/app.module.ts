import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Domain modules
import { BrokerModule } from './modules/broker/broker.module';
import { LoadModule } from './modules/load/load.module';
import { RouteModule } from './modules/route/route.module';
import { VanModule } from './modules/van/van.module';
import { DriverModule } from './modules/driver/driver.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { DocumentModule } from './modules/document/document.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    BrokerModule,
    LoadModule,
    RouteModule,
    VanModule,
    DriverModule,
    DispatchModule,
    DocumentModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
