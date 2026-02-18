import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrokerPaymentStatsDto {
  @ApiProperty({
    description: 'Total number of payment records for the broker',
    example: 42,
    type: Number,
  })
  totalLoads: number;

  @ApiProperty({
    description:
      'Number of paid records settled on time (paid on or before due date, or with non-positive daysOverdue)',
    example: 31,
    type: Number,
  })
  onTimeCount: number;

  @ApiProperty({
    description: 'Number of paid records settled after the due date',
    example: 8,
    type: Number,
  })
  delayedCount: number;

  @ApiProperty({
    description: 'Number of records in disputed or written-off statuses',
    example: 3,
    type: Number,
  })
  issuesCount: number;

  @ApiPropertyOptional({
    description:
      'Average number of days overdue across records where daysOverdue is present',
    example: 12.5,
    nullable: true,
    type: Number,
  })
  averagePaymentDays: number | null;
}
