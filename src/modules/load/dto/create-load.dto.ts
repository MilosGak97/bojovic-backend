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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  LoadStatus,
  Currency,
  BodyType,
  StopType,
  LoadBoardSource,
} from '../../../common/enums';

export class CreateLoadStopDto {
  @ApiProperty({
    description: 'Whether this stop is a pickup or a delivery point',
    example: StopType.PICKUP,
    enum: StopType,
    enumName: 'StopType',
  })
  @IsEnum(StopType)
  stopType: StopType;

  @ApiProperty({
    description: 'Full street address of the stop',
    example: 'Logistikzentrum Süd, Am Hafen 5',
    type: String,
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'City where the stop is located',
    example: 'Munich',
    type: String,
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Postal code of the stop location',
    example: '80331',
    type: String,
  })
  @IsString()
  postcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the stop location',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @IsString()
  @MaxLength(5)
  country: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate of the stop (WGS 84)',
    example: 48.1351,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the stop (WGS 84)',
    example: 11.582,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({
    description: 'Earliest date and time the stop must be serviced (ISO 8601 UTC)',
    example: '2026-02-20T07:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsDateString()
  dateFrom: string;

  @ApiPropertyOptional({
    description: 'Latest date and time by which the stop must be serviced (ISO 8601 UTC)',
    example: '2026-02-20T12:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Name of the on-site contact person at this stop',
    example: 'Hans Weber',
    type: String,
  })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the on-site contact person including country code',
    example: '+49 89 987654321',
    type: String,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Free-text notes or special instructions for this stop',
    example: 'Gate B – ring bell. Hard hat required on site.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Number of pallets loaded or unloaded at this stop',
    example: 4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  pallets?: number;

  @ApiPropertyOptional({
    description: 'Optional Transeu link specific to this stop',
    example: 'https://transeu.com/offers/12345',
    type: String,
  })
  @IsOptional()
  @IsString()
  transeuLink?: string;

  @ApiPropertyOptional({
    description: 'Zero-based position index determining the order of stops on the route',
    example: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateLoadFreightDto {
  @ApiPropertyOptional({
    description: 'Total gross weight of the cargo in metric tonnes',
    example: 18.5,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  weightTons?: number;

  @ApiPropertyOptional({
    description: 'Loading metres occupied by the cargo on a standard trailer floor',
    example: 7.4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  loadingMeters?: number;

  @ApiPropertyOptional({
    description: 'Total volume of the cargo in cubic metres',
    example: 42.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  volumeM3?: number;

  @ApiPropertyOptional({
    description: 'Number of pallets included in this shipment',
    example: 16,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  palletCount?: number;

  @ApiPropertyOptional({
    description: 'Required trailer/vehicle body type for transporting this load',
    example: BodyType.CURTAINSIDER,
    enum: BodyType,
    enumName: 'BodyType',
  })
  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @ApiPropertyOptional({
    description: 'Whether the cargo can be stacked on top of other goods',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the cargo is classified as hazardous (ADR)',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isHazardous?: boolean;

  @ApiPropertyOptional({
    description: 'ADR hazard class of the cargo (e.g. "3" for flammable liquids)',
    example: '3',
    type: String,
  })
  @IsOptional()
  @IsString()
  adrClass?: string;

  @ApiPropertyOptional({
    description: 'Minimum required transport temperature in degrees Celsius',
    example: 2.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  temperatureMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum allowed transport temperature in degrees Celsius',
    example: 8.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  temperatureMax?: number;

  @ApiPropertyOptional({
    description: 'Human-readable description of the goods being transported',
    example: 'Automotive spare parts – engine components, packaged in wooden crates',
    type: String,
  })
  @IsOptional()
  @IsString()
  goodsDescription?: string;
}

export class CreateLoadPalletDto {
  @ApiPropertyOptional({
    description: 'Optional human-readable label or name for this pallet group',
    example: 'Euro Pallet – Electronics',
    type: String,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Width of the pallet in centimetres',
    example: 80,
    type: Number,
  })
  @IsNumber()
  widthCm: number;

  @ApiProperty({
    description: 'Height of the pallet (including cargo) in centimetres',
    example: 120,
    type: Number,
  })
  @IsNumber()
  heightCm: number;

  @ApiPropertyOptional({
    description: 'Depth (length) of the pallet in centimetres',
    example: 120,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  depthCm?: number;

  @ApiPropertyOptional({
    description: 'Gross weight of a single pallet unit in kilograms',
    example: 650.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional({
    description: 'Whether this pallet type can be stacked during transport',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiPropertyOptional({
    description: 'Number of identical pallet units of this type in the shipment',
    example: 8,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class CreateLoadDto {
  @ApiProperty({
    description: 'Unique human-readable reference number for the load',
    example: 'FR/2026/02/13/CGC0',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @MaxLength(50)
  referenceNumber: string;

  @ApiPropertyOptional({
    description: 'Initial workflow status of the load (defaults to DRAFT if omitted)',
    example: LoadStatus.PUBLISHED,
    enum: LoadStatus,
    enumName: 'LoadStatus',
  })
  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;

  @ApiPropertyOptional({
    description: 'Source freight board or channel where this load originated',
    example: LoadBoardSource.TRANS_EU,
    enum: LoadBoardSource,
    enumName: 'LoadBoardSource',
  })
  @IsOptional()
  @IsEnum(LoadBoardSource)
  boardSource?: LoadBoardSource;

  @ApiPropertyOptional({
    description: 'Hex colour code used for visual grouping in the UI',
    example: '#3B82F6',
    maxLength: 7,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiPropertyOptional({
    description: 'Display name of the brokerage used in planner workflows',
    example: 'Hamburg Logistics GmbH',
    type: String,
  })
  @IsOptional()
  @IsString()
  brokerageName?: string;

  @ApiPropertyOptional({
    description: 'Optional Transeu link associated with the pickup location',
    example: 'https://transeu.com/offers/12345',
    type: String,
  })
  @IsOptional()
  @IsString()
  originTranseuLink?: string;

  @ApiPropertyOptional({
    description: 'Optional Transeu link associated with the delivery location',
    example: 'https://transeu.com/offers/12345',
    type: String,
  })
  @IsOptional()
  @IsString()
  destTranseuLink?: string;

  @ApiPropertyOptional({
    description: 'Planner visibility flag used to hide the load from active boards',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isInactive?: boolean;

  // Pickup
  @ApiProperty({
    description: 'Full street address of the pickup location',
    example: 'Industriestrasse 42',
    type: String,
  })
  @IsString()
  pickupAddress: string;

  @ApiProperty({
    description: 'City of the pickup location',
    example: 'Hamburg',
    type: String,
  })
  @IsString()
  pickupCity: string;

  @ApiProperty({
    description: 'Postal code of the pickup location',
    example: '20095',
    type: String,
  })
  @IsString()
  pickupPostcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the pickup location',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @IsString()
  @MaxLength(5)
  pickupCountry: string;

  @ApiProperty({
    description: 'Earliest date and time the cargo is available for pickup (ISO 8601 UTC)',
    example: '2026-02-20T06:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsDateString()
  pickupDateFrom: string;

  @ApiPropertyOptional({
    description: 'Latest date and time by which pickup must be completed (ISO 8601 UTC)',
    example: '2026-02-20T14:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  pickupDateTo?: string;

  // Delivery
  @ApiProperty({
    description: 'Full street address of the delivery location',
    example: 'Rue de la Paix 8',
    type: String,
  })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    description: 'City of the delivery location',
    example: 'Paris',
    type: String,
  })
  @IsString()
  deliveryCity: string;

  @ApiProperty({
    description: 'Postal code of the delivery location',
    example: '75001',
    type: String,
  })
  @IsString()
  deliveryPostcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the delivery location',
    example: 'FR',
    maxLength: 5,
    type: String,
  })
  @IsString()
  @MaxLength(5)
  deliveryCountry: string;

  @ApiProperty({
    description: 'Earliest date and time the cargo must arrive at delivery (ISO 8601 UTC)',
    example: '2026-02-22T07:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsDateString()
  deliveryDateFrom: string;

  @ApiPropertyOptional({
    description: 'Latest deadline for delivery (ISO 8601 UTC)',
    example: '2026-02-22T18:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  deliveryDateTo?: string;

  // Pricing
  @ApiPropertyOptional({
    description: 'Publicly advertised price for the load in the specified currency',
    example: 2800.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  publishedPrice?: number;

  @ApiPropertyOptional({
    description: 'Final negotiated price agreed with the carrier in the specified currency',
    example: 2650.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  agreedPrice?: number;

  @ApiPropertyOptional({
    description: 'Currency in which all prices for this load are expressed (defaults to EUR)',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({
    description: 'Number of days after invoice date by which payment is due',
    example: 30,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  paymentTermDays?: number;

  @ApiPropertyOptional({
    description: 'Whether this load uses Invoitix pricing/invoicing check',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  invoitix?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this load requires a valuta check',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  valutaCheck?: boolean;

  @ApiPropertyOptional({
    description: 'Total route distance in kilometres',
    example: 1087.5,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @ApiPropertyOptional({
    description: 'Name of the primary contact person for this load',
    example: 'Klaus Müller',
    type: String,
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the contact person including country code',
    example: '+49 40 123456789',
    type: String,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'E-mail address of the contact person',
    example: 'dispatch@broker-example.com',
    type: String,
  })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Whether real-time GPS vehicle monitoring is required for this load',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  vehicleMonitoringRequired?: boolean;

  @ApiPropertyOptional({
    description: 'UUID of the broker company to assign to this load',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @ApiPropertyOptional({
    description: 'Free-text internal notes or special instructions for this load',
    example: 'Fragile goods – handle with care. Notify recipient 2 hours before arrival.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // Nested
  @ApiPropertyOptional({
    description: 'Freight details (weight, dimensions, hazard info) for this load',
    type: () => CreateLoadFreightDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLoadFreightDto)
  freightDetails?: CreateLoadFreightDto;

  @ApiPropertyOptional({
    description: 'List of pallet entries describing the cargo packaging',
    type: () => [CreateLoadPalletDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoadPalletDto)
  pallets?: CreateLoadPalletDto[];

  @ApiPropertyOptional({
    description: 'Ordered list of intermediate pickup and delivery stops for this load',
    type: () => [CreateLoadStopDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLoadStopDto)
  stops?: CreateLoadStopDto[];
}
