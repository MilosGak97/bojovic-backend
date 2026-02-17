import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { VanStatus } from '../../../common/enums';

export class CreateVanDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(20)
  licensePlate: string;

  @IsOptional()
  @IsEnum(VanStatus)
  status?: VanStatus;

  @IsNumber()
  maxWeightKg: number;

  @IsNumber()
  cargoLengthCm: number;

  @IsNumber()
  cargoWidthCm: number;

  @IsNumber()
  cargoHeightCm: number;

  @IsOptional()
  @IsNumber()
  maxLoadingMeters?: number;

  @IsOptional()
  @IsNumber()
  maxPallets?: number;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  fuelConsumptionPer100km?: number;

  @IsOptional()
  @IsNumber()
  odometerKm?: number;

  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;

  @IsOptional()
  @IsDateString()
  insuranceValidUntil?: string;

  @IsOptional()
  @IsDateString()
  technicalInspectionUntil?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
