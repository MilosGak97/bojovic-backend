import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency, ExpenseCategory, ExpenseType } from '../../../common/enums';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Accounting category of the expense',
    example: ExpenseCategory.FUEL,
    enum: ExpenseCategory,
    enumName: 'ExpenseCategory',
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiPropertyOptional({
    description: 'Expense type classification',
    example: ExpenseType.TRIP_LINKED,
    enum: ExpenseType,
    enumName: 'ExpenseType',
    default: ExpenseType.VARIABLE,
  })
  @IsOptional()
  @IsEnum(ExpenseType)
  expenseType?: ExpenseType;

  @ApiProperty({
    description: 'Net amount of the expense (without VAT)',
    example: 320.5,
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Currency of the expense amount',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({
    description: 'VAT rate percentage',
    example: 19,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @ApiPropertyOptional({
    description: 'VAT amount',
    example: 60.9,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  vatAmount?: number;

  @ApiPropertyOptional({
    description: 'Total amount including VAT',
    example: 381.4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  totalWithVat?: number;

  @ApiProperty({
    description: 'Date when expense was incurred',
    example: '2026-02-19',
    format: 'date',
    type: String,
  })
  @IsDateString()
  expenseDate: string;

  @ApiPropertyOptional({
    description: 'Short description of the expense',
    example: 'Fuel at service station A3',
    maxLength: 500,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Receipt URL',
    example: 'https://cdn.example.com/receipt/123.pdf',
    maxLength: 1000,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  receiptUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether this expense is recurring',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Label for recurring expense template',
    example: 'Monthly Insurance',
    maxLength: 200,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  recurringLabel?: string;

  @ApiPropertyOptional({
    description: 'Vendor or supplier',
    example: 'Shell Deutschland GmbH',
    maxLength: 200,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  vendor?: string;

  @ApiPropertyOptional({
    description: 'External reference number',
    example: 'INV-EXP-2026-001',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Internal notes',
    example: 'Paid with company card #2',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Related van UUID',
    example: '0f5eec83-22bd-4a4a-92f3-2c793fca1485',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  vanId?: string;

  @ApiPropertyOptional({
    description: 'Related driver UUID',
    example: '162774fe-bbde-473e-83d4-fe8af867dadf',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({
    description: 'Related load UUID',
    example: 'c7d9ffac-4474-4bb4-ab29-cef6d07c26be',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  loadId?: string;
}
