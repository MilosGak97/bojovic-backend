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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';
import { MarkPaymentPaidDto } from './dto/mark-payment-paid.dto';
import { BrokerPaymentStatsDto } from './dto/broker-payment-stats.dto';
import { PaymentRecord } from './entities/payment-record.entity';

@ApiTags('Payments')
@ApiExtraModels(
  CreatePaymentRecordDto,
  UpdatePaymentRecordDto,
  MarkPaymentPaidDto,
  BrokerPaymentStatsDto,
  PaymentRecord,
)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ─── Create ─────────────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({
    summary: 'Create a new payment record',
    description:
      'Creates a payment record linking a freight load to a broker company. ' +
      'At minimum a loadId, brokerId, and net amount are required. ' +
      'VAT fields and dates can be provided upfront or updated later.',
  })
  @ApiBody({
    type: CreatePaymentRecordDto,
    description: 'Payload for the new payment record',
    examples: {
      minimal: {
        summary: 'Minimal — required fields only',
        value: {
          loadId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          brokerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          amount: 450.00,
        },
      },
      full: {
        summary: 'Full — all fields including VAT and payment term',
        value: {
          loadId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          brokerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          status: 'INVOICED',
          method: 'BANK_TRANSFER',
          invoiceNumber: 'INV-2026-0001',
          amount: 450.00,
          currency: 'EUR',
          vatRate: 19.00,
          vatAmount: 85.50,
          totalWithVat: 535.50,
          issueDate: '2026-01-15',
          dueDate: '2026-03-16',
          paymentTermDays: 60,
          notes: 'Standard 60-day term as per contract.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Payment record created successfully.',
    type: PaymentRecord,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more fields are missing or have an invalid value.',
  })
  create(@Body() dto: CreatePaymentRecordDto) {
    return this.paymentService.create(dto);
  }

  // ─── Read — overdue list ─────────────────────────────────────────────────────

  @Get('overdue')
  @ApiOperation({
    summary: 'List all overdue payment records',
    description:
      'Returns every payment record whose due date has passed and whose status ' +
      'is not yet PAID or WRITTEN_OFF. Records are returned in ascending order ' +
      'of due date (oldest overdue first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of overdue payment records (may be empty).',
    type: [PaymentRecord],
  })
  findOverdue() {
    return this.paymentService.findOverdue();
  }

  // ─── Read — single record ────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single payment record by ID',
    description:
      'Fetches one payment record by its UUID, including the related load and broker relations.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment record to retrieve',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment record found and returned.',
    type: PaymentRecord,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No payment record exists with the given id.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  // ─── Read — filtered list ────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List payment records filtered by load or broker',
    description:
      'Returns all payment records associated with the specified load (loadId) ' +
      'or broker (brokerId). Exactly one query parameter should be provided. ' +
      'If neither is supplied the endpoint returns an empty array.',
  })
  @ApiQuery({
    name: 'loadId',
    required: false,
    description: 'Filter by the UUID of a specific freight load',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: String,
    format: 'uuid',
  })
  @ApiQuery({
    name: 'brokerId',
    required: false,
    description: 'Filter by the UUID of a specific broker company',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of matching payment records (may be empty).',
    type: [PaymentRecord],
  })
  findByEntity(
    @Query('loadId') loadId?: string,
    @Query('brokerId') brokerId?: string,
  ) {
    if (loadId) return this.paymentService.findByLoad(loadId);
    if (brokerId) return this.paymentService.findByBroker(brokerId);
    return [];
  }

  // ─── Update — full replacement ───────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({
    summary: 'Fully update a payment record',
    description:
      'Replaces the updatable fields of an existing payment record. ' +
      'All fields accepted by CreatePaymentRecordDto are optional here; ' +
      'only supplied fields are written — a PUT on this endpoint performs a ' +
      'partial update (equivalent to PATCH) because all DTO fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment record to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiBody({
    type: UpdatePaymentRecordDto,
    description: 'Fields to update on the payment record',
    examples: {
      setInvoice: {
        summary: 'Assign invoice number and 60-day payment term',
        value: {
          invoiceNumber: 'INV-2026-0001',
          issueDate: '2026-01-15',
          dueDate: '2026-03-16',
          paymentTermDays: 60,
          status: 'INVOICED',
        },
      },
      addVat: {
        summary: 'Set VAT fields after invoice issued',
        value: {
          vatRate: 19.00,
          vatAmount: 85.50,
          totalWithVat: 535.50,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment record updated successfully; returns the updated record.',
    type: PaymentRecord,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or the supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No payment record exists with the given id.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentRecordDto,
  ) {
    return this.paymentService.update(id, dto);
  }

  // ─── Patch — mark paid ───────────────────────────────────────────────────────

  @Patch(':id/paid')
  @ApiOperation({
    summary: 'Mark a payment record as paid',
    description:
      'Sets the payment status to PAID and records the settlement date. ' +
      'If paidDate is not supplied in the request body, the current server ' +
      'date is used. This is a convenience endpoint to avoid a full PUT when ' +
      'only confirming receipt of payment.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the payment record to mark as paid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiBody({
    required: false,
    type: MarkPaymentPaidDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment record status set to PAID; returns the updated record.',
    type: PaymentRecord,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied id is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No payment record exists with the given id.',
  })
  markPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MarkPaymentPaidDto,
  ) {
    return this.paymentService.markPaid(id, dto.paidDate);
  }

  // ─── Stats — broker summary ──────────────────────────────────────────────────

  @Get('broker/:brokerId/stats')
  @ApiOperation({
    summary: 'Get aggregated payment statistics for a broker',
    description:
      'Returns a summary of payment activity for the specified broker, ' +
      'including totals per status (PENDING, INVOICED, PAID, OVERDUE, etc.), ' +
      'the total outstanding amount in EUR, and average days-overdue. ' +
      'Useful for risk assessment and cash-flow reporting.',
  })
  @ApiParam({
    name: 'brokerId',
    description: 'UUID of the broker company to compute statistics for',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregated payment statistics for the broker.',
    type: BrokerPaymentStatsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The supplied brokerId is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No broker exists with the given brokerId.',
  })
  getBrokerStats(@Param('brokerId', ParseUUIDPipe) brokerId: string) {
    return this.paymentService.getBrokerStats(brokerId);
  }
}
