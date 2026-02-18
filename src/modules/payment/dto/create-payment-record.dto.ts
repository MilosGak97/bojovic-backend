import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentMethod, Currency } from '../../../common/enums';

export class CreatePaymentRecordDto {
  @ApiProperty({
    description: 'UUID of the freight load this payment record should be linked to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  loadId: string;

  @ApiProperty({
    description: 'UUID of the broker company that is responsible for making the payment',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  brokerId: string;

  @ApiPropertyOptional({
    description: 'Initial billing and settlement status of the payment record; defaults to PENDING when omitted',
    example: PaymentStatus.PENDING,
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    default: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Payment method agreed with the broker for settling this invoice',
    example: PaymentMethod.BANK_TRANSFER,
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Unique invoice reference number to be printed on the invoice document',
    example: 'INV-2026-0001',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Net invoice amount before VAT, expressed in the specified currency',
    example: 450.00,
    type: Number,
    format: 'decimal',
    minimum: 0,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'ISO 4217 currency code for the invoice amount; defaults to EUR when omitted',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({
    description: 'VAT rate to apply to the net amount, expressed as a percentage (e.g. 19 for 19%)',
    example: 19.00,
    type: Number,
    format: 'decimal',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @ApiPropertyOptional({
    description: 'Pre-calculated VAT monetary amount; if omitted it should be derived from amount × vatRate / 100',
    example: 85.50,
    type: Number,
    format: 'decimal',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  vatAmount?: number;

  @ApiPropertyOptional({
    description: 'Pre-calculated total invoice amount inclusive of VAT (net amount + VAT amount)',
    example: 535.50,
    type: Number,
    format: 'decimal',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  totalWithVat?: number;

  @ApiPropertyOptional({
    description: 'ISO 8601 date string representing the date the invoice was issued to the broker',
    example: '2026-01-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: 'ISO 8601 date string representing the deadline by which payment must be received',
    example: '2026-03-16',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'ISO 8601 date string representing the date on which payment was actually received; set when marking a payment as PAID',
    example: '2026-03-10',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @ApiPropertyOptional({
    description: 'Number of days from the invoice issue date within which the broker must pay; standard European freight term is 60 days',
    example: 60,
    type: Number,
    minimum: 1,
    maximum: 365,
  })
  @IsOptional()
  @IsNumber()
  paymentTermDays?: number;

  @ApiPropertyOptional({
    description: 'Free-text notes or remarks to attach to this payment record (e.g. special payment instructions, dispute context)',
    example: 'Broker requested payment split into two instalments. First instalment due 2026-02-15.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
