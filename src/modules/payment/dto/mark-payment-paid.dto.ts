import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class MarkPaymentPaidDto {
  @ApiPropertyOptional({
    description:
      'ISO date string for when payment was received. If omitted, server uses the current date.',
    format: 'date',
    example: '2026-03-10',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  paidDate?: string;
}
