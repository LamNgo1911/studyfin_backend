import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UnifiedSearchQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword for full-text matching' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: ['programs', 'institutions'], description: 'Filter to only programs or only institutions. Omit for both.' })
  @IsOptional()
  @IsIn(['programs', 'institutions'])
  type?: 'programs' | 'institutions';

  @ApiPropertyOptional({ default: 20, description: 'Results per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional({ default: 0, description: 'Page number (0-indexed)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}
