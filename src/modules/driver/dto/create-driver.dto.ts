import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { DriverStatus } from '../../../common/enums';

export class CreateDriverDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  driverLicenseNumber?: string;

  @IsOptional()
  @IsDateString()
  driverLicenseValidUntil?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  driverLicenseCategories?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(5)
  nationality?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsBoolean()
  adrCertified?: boolean;

  @IsOptional()
  @IsDateString()
  adrValidUntil?: string;

  @IsOptional()
  @IsDateString()
  hiredAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
