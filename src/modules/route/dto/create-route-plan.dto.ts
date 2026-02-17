import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RouteStatus, StopType } from '../../../common/enums';

export class CreateRouteStopDto {
  @IsUUID()
  loadId: string;

  @IsEnum(StopType)
  stopType: StopType;

  @IsNumber()
  orderIndex: number;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  postcode: string;

  @IsString()
  @MaxLength(5)
  country: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsDateString()
  eta?: string;

  @IsOptional()
  @IsDateString()
  timeWindowFrom?: string;

  @IsOptional()
  @IsDateString()
  timeWindowTo?: string;

  @IsOptional()
  @IsNumber()
  distanceToNextKm?: number;

  @IsOptional()
  @IsNumber()
  drivingTimeToNextMinutes?: number;

  @IsOptional()
  @IsNumber()
  pallets?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRoutePlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(RouteStatus)
  status?: RouteStatus;

  @IsOptional()
  @IsUUID()
  vanId?: string;

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRouteStopDto)
  stops?: CreateRouteStopDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
