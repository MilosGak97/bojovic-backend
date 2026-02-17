import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LoadStatus, Currency, BodyType, StopType } from '../../../common/enums';

export class CreateLoadStopDto {
  @IsEnum(StopType)
  stopType: StopType;

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

  @IsDateString()
  dateFrom: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateLoadFreightDto {
  @IsOptional()
  @IsNumber()
  weightTons?: number;

  @IsOptional()
  @IsNumber()
  loadingMeters?: number;

  @IsOptional()
  @IsNumber()
  volumeM3?: number;

  @IsOptional()
  @IsNumber()
  palletCount?: number;

  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @IsOptional()
  @IsBoolean()
  isHazardous?: boolean;

  @IsOptional()
  @IsString()
  adrClass?: string;

  @IsOptional()
  @IsNumber()
  temperatureMin?: number;

  @IsOptional()
  @IsNumber()
  temperatureMax?: number;

  @IsOptional()
  @IsString()
  goodsDescription?: string;
}

export class CreateLoadPalletDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsNumber()
  widthCm: number;

  @IsNumber()
  heightCm: number;

  @IsOptional()
  @IsNumber()
  depthCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class CreateLoadDto {
  @IsString()
  @MaxLength(50)
  referenceNumber: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  // Pickup
  @IsString()
  pickupAddress: string;

  @IsString()
  pickupCity: string;

  @IsString()
  pickupPostcode: string;

  @IsString()
  @MaxLength(5)
  pickupCountry: string;

  @IsDateString()
  pickupDateFrom: string;

  @IsOptional()
  @IsDateString()
  pickupDateTo?: string;

  // Delivery
  @IsString()
  deliveryAddress: string;

  @IsString()
  deliveryCity: string;

  @IsString()
  deliveryPostcode: string;

  @IsString()
  @MaxLength(5)
  deliveryCountry: string;

  @IsDateString()
  deliveryDateFrom: string;

  @IsOptional()
  @IsDateString()
  deliveryDateTo?: string;

  // Pricing
  @IsOptional()
  @IsNumber()
  publishedPrice?: number;

  @IsOptional()
  @IsNumber()
  agreedPrice?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsNumber()
  paymentTermDays?: number;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsBoolean()
  vehicleMonitoringRequired?: boolean;

  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // Nested
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLoadFreightDto)
  freightDetails?: CreateLoadFreightDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoadPalletDto)
  pallets?: CreateLoadPalletDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoadStopDto)
  stops?: CreateLoadStopDto[];
}
