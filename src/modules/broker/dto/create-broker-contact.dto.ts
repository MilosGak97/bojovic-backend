import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactRole } from '../../../common/enums';

export class CreateBrokerContactDto {
  @ApiProperty({
    description: 'UUID of the broker company this contact should be associated with',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    description: 'First (given) name of the contact person',
    example: 'Klaus',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last (family) name of the contact person',
    example: 'Schreiber',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Functional role of this contact within the broker organisation. Defaults to DISPATCHER when omitted.',
    example: ContactRole.DISPATCHER,
    enum: ContactRole,
    enumName: 'ContactRole',
    default: ContactRole.DISPATCHER,
  })
  @IsOptional()
  @IsEnum(ContactRole)
  role?: ContactRole;

  @ApiPropertyOptional({
    description: 'Direct e-mail address of the contact person',
    example: 'k.schreiber@mueller-logistik.de',
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Office or direct-dial phone number of the contact person, including international dialling code',
    example: '+49 30 12345679',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Mobile / cell phone number of the contact person, including international dialling code',
    example: '+49 172 9876543',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mobile?: string;

  @ApiPropertyOptional({
    description: 'Set to true to mark this as the primary contact for the broker company. Only one contact per company should be primary.',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Free-text internal notes about this contact person',
    example: 'Available Mon-Fri 07:00-18:00 CET. Speaks German, English, Polish.',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
