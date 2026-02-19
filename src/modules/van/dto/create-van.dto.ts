import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VanStatus, VanType, Currency } from '../../../common/enums';

export class CreateVanDto {
  @ApiProperty({
    description: 'Human-readable display name for the van',
    example: 'Van Berlin 01',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Unique vehicle license plate number',
    example: 'B-VD-2301',
    maxLength: 20,
    type: String,
  })
  @IsString()
  @MaxLength(20)
  licensePlate: string;

  @ApiPropertyOptional({
    description: 'Initial operational status of the van; defaults to AVAILABLE when omitted',
    example: VanStatus.AVAILABLE,
    enum: VanStatus,
    enumName: 'VanStatus',
    default: VanStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(VanStatus)
  status?: VanStatus;

  @ApiPropertyOptional({
    description: 'High-level vehicle class used for planning presets',
    example: VanType.VAN_3_5T,
    enum: VanType,
    enumName: 'VanType',
    default: VanType.CARGO_VAN,
  })
  @IsOptional()
  @IsEnum(VanType)
  vehicleType?: VanType;

  @ApiProperty({
    description: 'Maximum payload weight the van can carry in kilograms',
    example: 3500,
    type: Number,
    format: 'decimal',
  })
  @IsNumber()
  maxWeightKg: number;

  @ApiProperty({
    description: 'Internal cargo compartment length in centimetres',
    example: 403,
    type: Number,
  })
  @IsNumber()
  cargoLengthCm: number;

  @ApiProperty({
    description: 'Internal cargo compartment width in centimetres',
    example: 220,
    type: Number,
  })
  @IsNumber()
  cargoWidthCm: number;

  @ApiProperty({
    description: 'Internal cargo compartment height in centimetres',
    example: 220,
    type: Number,
  })
  @IsNumber()
  cargoHeightCm: number;

  @ApiPropertyOptional({
    description: 'Maximum load length expressed as loading metres (LDM)',
    example: 7.2,
    type: Number,
    format: 'decimal',
  })
  @IsOptional()
  @IsNumber()
  maxLoadingMeters?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of euro pallets (80 x 120 cm) the van can carry',
    example: 6,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  maxPallets?: number;

  @ApiPropertyOptional({
    description: 'Vehicle manufacturer / brand name',
    example: 'Mercedes-Benz',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({
    description: 'Vehicle model designation',
    example: 'Sprinter 316 CDI',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Four-digit year of manufacture',
    example: 2021,
    type: Number,
    minimum: 1900,
    maximum: 2100,
  })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    description: 'Average fuel consumption in litres per 100 kilometres',
    example: 8.5,
    type: Number,
    format: 'decimal',
  })
  @IsOptional()
  @IsNumber()
  fuelConsumptionPer100km?: number;

  @ApiPropertyOptional({
    description: 'Current odometer reading in kilometres',
    example: 124500,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  odometerKm?: number;

  @ApiPropertyOptional({
    description: 'Date of the next scheduled vehicle service (ISO 8601 date string)',
    example: '2026-06-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;

  @ApiPropertyOptional({
    description: 'Date until which the vehicle insurance policy is valid (ISO 8601 date string)',
    example: '2026-12-31',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  insuranceValidUntil?: string;

  @ApiPropertyOptional({
    description:
      'Date until which the technical roadworthiness inspection (TUV / MOT) is valid (ISO 8601 date string)',
    example: '2027-03-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  technicalInspectionUntil?: string;

  @ApiPropertyOptional({
    description: 'Fixed monthly leasing cost for this vehicle',
    example: 980.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  monthlyLeasingCost?: number;

  @ApiPropertyOptional({
    description: 'Fixed monthly insurance cost for this vehicle',
    example: 240.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  monthlyInsuranceCost?: number;

  @ApiPropertyOptional({
    description: 'Currency used for fixed monthly cost fields',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
  })
  @IsOptional()
  @IsEnum(Currency)
  costCurrency?: Currency;

  @ApiPropertyOptional({
    description: 'Free-text notes or remarks about the van (e.g. known issues, special equipment)',
    example: 'Tail-lift installed. Requires pre-booking for ferry crossings.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
