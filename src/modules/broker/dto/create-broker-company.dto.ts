import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrokerCompanyDto {
  @ApiProperty({
    description: 'Trading name of the broker company as used in day-to-day operations',
    example: 'Müller Logistik GmbH',
    maxLength: 255,
    type: String,
  })
  @IsString()
  @MaxLength(255)
  companyName: string;

  @ApiPropertyOptional({
    description: 'Official registered legal name of the company, if different from the trading name',
    example: 'Müller Logistik Gesellschaft mit beschränkter Haftung',
    maxLength: 255,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @ApiProperty({
    description: 'National tax identification number (e.g. Steuernummer in Germany, NIP in Poland). Must be unique across all broker companies.',
    example: 'DE-123456789',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @MaxLength(50)
  taxId: string;

  @ApiPropertyOptional({
    description: 'EU VAT identification number used for cross-border invoicing within the European Union',
    example: 'DE123456789',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vatId?: string;

  @ApiProperty({
    description: 'Street address including house or building number of the company headquarters',
    example: 'Frankfurter Allee 120',
    maxLength: 255,
    type: String,
  })
  @IsString()
  @MaxLength(255)
  street: string;

  @ApiProperty({
    description: 'City where the company headquarters is located',
    example: 'Berlin',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Postal / ZIP code of the company headquarters',
    example: '10247',
    maxLength: 20,
    type: String,
  })
  @IsString()
  @MaxLength(20)
  postcode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code of the company headquarters',
    example: 'DE',
    maxLength: 5,
    type: String,
  })
  @IsString()
  @MaxLength(5)
  country: string;

  @ApiPropertyOptional({
    description: 'Approximate number of employees in the broker company',
    example: 42,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  employeeCount?: number;

  @ApiPropertyOptional({
    description: 'Main office phone number including international dialling code',
    example: '+49 30 12345678',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'General company e-mail address used for business correspondence',
    example: 'info@mueller-logistik.de',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://www.mueller-logistik.de',
    type: String,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Broker identifier on the Trans.eu freight exchange platform',
    example: 'TRANS-EU-98765',
    type: String,
  })
  @IsOptional()
  @IsString()
  transEuId?: string;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of invoices/loads paid on time',
    example: 974,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  transEuPaidOnTime?: number;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of invoices/loads paid with delay',
    example: 0,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  transEuPaidWithDelay?: number;

  @ApiPropertyOptional({
    description: 'Trans.eu payment reliability metric: number of payment issues/disputes',
    example: 3,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  transEuPaymentIssues?: number;

  @ApiPropertyOptional({
    description: 'Trans.eu profile rating value as presented on platform (string form to preserve locale formats, e.g. 5,0)',
    example: '5,0',
    maxLength: 20,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  transEuRating?: string;

  @ApiPropertyOptional({
    description: 'Trans.eu number of reviews backing the current profile rating',
    example: 1014,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  transEuReviewCount?: number;

  @ApiPropertyOptional({
    description: 'Maximum cargo insurance coverage amount in EUR',
    example: 100000,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  insuranceCoverage?: number;

  @ApiPropertyOptional({
    description: 'Name of the insurance company providing the cargo liability coverage',
    example: 'Allianz SE',
    type: String,
  })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({
    description: 'Date until which the cargo insurance policy is valid (ISO 8601 date string)',
    example: '2025-12-31',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  insuranceValidUntil?: string;

  @ApiPropertyOptional({
    description: 'Freight broker operating licence number issued by the relevant national authority',
    example: 'LIC-DE-2024-004521',
    type: String,
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'Expiry date of the operating licence (ISO 8601 date string)',
    example: '2026-06-30',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  licenseValidUntil?: string;

  @ApiPropertyOptional({
    description: 'Date when the broker was first registered on this platform (ISO 8601 date string)',
    example: '2022-03-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  platformMemberSince?: string;

  @ApiPropertyOptional({
    description: 'Free-text internal notes about the broker company visible only to platform operators',
    example: 'Reliable partner since 2022. Preferred for DE-PL lanes.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether this broker company is currently active and can be assigned to loads. Defaults to true when omitted.',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
