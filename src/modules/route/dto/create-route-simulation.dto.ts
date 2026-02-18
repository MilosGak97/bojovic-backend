import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRouteSimulationDto {
  @ApiPropertyOptional({
    description: 'Optional human-readable name for the simulation scenario',
    example: 'Add Prague pickup before Berlin drop',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
