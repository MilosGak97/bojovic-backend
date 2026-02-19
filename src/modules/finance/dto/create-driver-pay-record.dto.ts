import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Currency, DriverPayStatus } from '../../../common/enums';

export class CreateDriverPayRecordDto {
  @ApiProperty({
    description: 'Driver UUID',
    example: '162774fe-bbde-473e-83d4-fe8af867dadf',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  driverId: string;

  @ApiProperty({
    description: 'Payroll year',
    example: 2026,
    type: Number,
  })
  @IsInt()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty({
    description: 'Payroll month in range 1-12',
    example: 2,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Base salary amount',
    example: 2400,
    type: Number,
  })
  @IsNumber()
  baseSalary: number;

  @ApiPropertyOptional({
    description: 'Total per diem amount',
    example: 300,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  perDiemTotal?: number;

  @ApiPropertyOptional({
    description: 'Bonus amount',
    example: 150,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  bonus?: number;

  @ApiPropertyOptional({
    description: 'Deductions amount',
    example: 80,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  deductions?: number;

  @ApiPropertyOptional({
    description: 'Currency for payroll amounts',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
    default: Currency.EUR,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({
    description: 'Initial payroll status',
    example: DriverPayStatus.PENDING,
    enum: DriverPayStatus,
    enumName: 'DriverPayStatus',
    default: DriverPayStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(DriverPayStatus)
  status?: DriverPayStatus;

  @ApiPropertyOptional({
    description: 'Paid date if already paid',
    example: '2026-03-05',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @ApiPropertyOptional({
    description: 'Internal payroll notes',
    example: 'Includes weekend bonus.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
