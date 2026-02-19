import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DriverStatus, Currency } from '../../../common/enums';

export class CreateDriverDto {
  @ApiProperty({
    description: 'First name of the driver',
    example: 'Klaus',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the driver',
    example: 'Müller',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Initial operational duty state of the driver; defaults to AVAILABLE when omitted',
    example: DriverStatus.AVAILABLE,
    enum: DriverStatus,
    enumName: 'DriverStatus',
  })
  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @ApiPropertyOptional({
    description: 'Contact phone number of the driver (any format accepted)',
    example: '+49 151 23456789',
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Contact email address of the driver',
    example: 'k.mueller@spedition-berlin.de',
    format: 'email',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Official driver licence number as printed on the document',
    example: 'B072-123456-DL9',
    type: String,
  })
  @IsOptional()
  @IsString()
  driverLicenseNumber?: string;

  @ApiPropertyOptional({
    description: 'Expiry date of the driver licence in ISO 8601 format (YYYY-MM-DD)',
    example: '2028-03-15',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  driverLicenseValidUntil?: string;

  @ApiPropertyOptional({
    description: 'List of EU driver licence categories held by the driver',
    example: ['B', 'C', 'CE'],
    isArray: true,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  driverLicenseCategories?: string[];

  @ApiPropertyOptional({
    description: 'ISO 3166-1 alpha-2 country code representing the driver\'s nationality',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Date of birth of the driver in ISO 8601 format (YYYY-MM-DD)',
    example: '1985-07-22',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Set to true if the driver holds a valid ADR certificate for carrying dangerous goods',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  adrCertified?: boolean;

  @ApiPropertyOptional({
    description: 'Expiry date of the ADR (dangerous goods) certificate in ISO 8601 format (YYYY-MM-DD)',
    example: '2026-11-30',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  adrValidUntil?: string;

  @ApiPropertyOptional({
    description: 'Date on which the driver was hired by the company in ISO 8601 format (YYYY-MM-DD)',
    example: '2021-04-01',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  hiredAt?: string;

  @ApiPropertyOptional({
    description: 'Fixed monthly salary amount for this driver',
    example: 2400.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  monthlySalary?: number;

  @ApiPropertyOptional({
    description: 'Currency in which the fixed monthly salary is defined',
    example: Currency.EUR,
    enum: Currency,
    enumName: 'Currency',
  })
  @IsOptional()
  @IsEnum(Currency)
  salaryCurrency?: Currency;

  @ApiPropertyOptional({
    description: 'Free-text notes or remarks about the driver (e.g. restrictions, preferences)',
    example: 'Prefers long-haul routes. No night shifts requested.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
