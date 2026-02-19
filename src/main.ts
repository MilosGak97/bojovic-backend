import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Swagger ────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bojovic Transport Dispatch API')
    .setDescription(
      'Professional European logistics dispatch system API.\n\n' +
      'Manages loads, brokers, routes, vans, drivers, dispatch assignments, ' +
      'documents, and payments for a multi-van freight dispatch operation.\n\n' +
      '**Key features:**\n' +
      '- Timeline-based cargo state (derived by replaying stop events)\n' +
      '- Route simulation (what-if mode with delta comparison)\n' +
      '- Broker trust scoring and payment tracking\n' +
      '- Document management across all domain entities',
    )
    .setVersion('1.0.0')
    .addTag('Brokers', 'Brokerage company management, contacts, and trust profiles')
    .addTag('Loads', 'Freight load management with stops, pallets, and freight details')
    .addTag('Routes', 'Route planning, simulation, and cargo timeline replay')
    .addTag('Vans', 'Vehicle fleet management and capacity tracking')
    .addTag('Drivers', 'Driver management, licensing, and availability')
    .addTag('Dispatch', 'Van + driver + route assignment management')
    .addTag('Documents', 'Document management for loads, brokers, drivers, and vans')
    .addTag('Payments', 'Payment tracking, invoicing, and broker payment statistics')
    .addTag('Finance', 'Expenses, payroll records, and profitability reporting')
    .addTag('System', 'Service-level health/info endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
