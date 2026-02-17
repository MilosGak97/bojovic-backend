import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateBrokerCompanyDto {
  @IsString()
  @MaxLength(255)
  companyName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @IsString()
  @MaxLength(50)
  taxId: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vatId?: string;

  @IsString()
  @MaxLength(255)
  street: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(20)
  postcode: string;

  @IsString()
  @MaxLength(5)
  country: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  transEuId?: string;

  @IsOptional()
  @IsNumber()
  insuranceCoverage?: number;

  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @IsOptional()
  @IsDateString()
  insuranceValidUntil?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsDateString()
  licenseValidUntil?: string;

  @IsOptional()
  @IsDateString()
  platformMemberSince?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
