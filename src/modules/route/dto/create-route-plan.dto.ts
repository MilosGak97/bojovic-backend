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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RouteStatus, StopType } from '../../../common/enums';

export class CreateRouteStopDto {
  @ApiProperty({
    description: 'UUID of the freight load associated with this stop',
    example: 'c2d3e4f5-a6b7-8901-cdef-012345678901',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  loadId: string;

  @ApiProperty({
    description: 'Whether this stop is a cargo pickup or delivery point',
    example: StopType.PICKUP,
    enum: StopType,
    enumName: 'StopType',
  })
  @IsEnum(StopType)
  stopType: StopType;

  @ApiProperty({
    description: 'Zero-based sequential index determining the visit order of stops on the route',
    example: 0,
    type: Number,
  })
  @IsNumber()
  orderIndex: number;

  @ApiPropertyOptional({
    description: 'UUID grouping paired pickup and delivery stops for the same load; used to visually link related stops in the UI',
    example: 'd4e5f6a7-b8c9-0123-defa-123456789012',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiProperty({
    description: 'Full street address of the stop location',
    example: 'Industriestraße 47',
    type: String,
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'City name of the stop location',
    example: 'Hamburg',
    type: String,
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Postal code of the stop location',
    example: '20457',
    type: String,
  })
  @IsString()
  postcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the stop location (max 5 characters)',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @IsString()
  @MaxLength(5)
  country: string;

  @ApiPropertyOptional({
    description: 'WGS84 latitude coordinate of the stop location',
    example: 53.5488,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'WGS84 longitude coordinate of the stop location',
    example: 9.9872,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({
    description: 'Estimated time of arrival at this stop in ISO 8601 format (UTC)',
    example: '2024-07-16T09:30:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  eta?: string;

  @ApiPropertyOptional({
    description: 'Start of the customer-requested delivery or pickup time window in ISO 8601 format (UTC)',
    example: '2024-07-16T08:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  timeWindowFrom?: string;

  @ApiPropertyOptional({
    description: 'End of the customer-requested delivery or pickup time window in ISO 8601 format (UTC)',
    example: '2024-07-16T12:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  timeWindowTo?: string;

  @ApiPropertyOptional({
    description: 'Driving distance from this stop to the next stop on the route in kilometres',
    example: 312.4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  distanceToNextKm?: number;

  @ApiPropertyOptional({
    description: 'Estimated driving time from this stop to the next stop in minutes (excluding rest breaks)',
    example: 195,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  drivingTimeToNextMinutes?: number;

  @ApiPropertyOptional({
    description: 'Number of EUR pallets being picked up or delivered at this stop',
    example: 14,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  pallets?: number;

  @ApiPropertyOptional({
    description: 'Total cargo weight handled at this stop in kilograms',
    example: 8750.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional({
    description: 'Free-text notes for this specific stop, e.g. gate codes, contact details, or special handling instructions',
    example: 'Gate B3. Call +49 40 123456 30 min before arrival. Forklift available.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRoutePlanDto {
  @ApiPropertyOptional({
    description: 'Human-readable name for the route plan',
    example: 'Warsaw → Berlin → Hamburg run',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Initial operational state of the route plan; defaults to DRAFT when omitted',
    example: RouteStatus.DRAFT,
    enum: RouteStatus,
    enumName: 'RouteStatus',
  })
  @IsOptional()
  @IsEnum(RouteStatus)
  status?: RouteStatus;

  @ApiPropertyOptional({
    description: 'UUID of the van to assign to this route plan',
    example: 'b3c4d5e6-f7a8-9012-bcde-f34567890abc',
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  vanId?: string;

  @ApiPropertyOptional({
    description: 'Planned departure date and time for the route in ISO 8601 format (UTC)',
    example: '2024-07-15T05:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiPropertyOptional({
    description: 'Ordered list of stops that make up the route; each stop must specify a load, type, and location',
    type: [CreateRouteStopDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRouteStopDto)
  stops?: CreateRouteStopDto[];

  @ApiPropertyOptional({
    description: 'Free-text dispatcher notes or instructions for this route plan',
    example: 'Check customs documents at DE border. Avoid toll road A2 between Frankfurt and Hannover.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
