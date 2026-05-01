import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const ALLOWED_STATUSES = [
  'interested',
  'applying',
  'applied',
  'accepted',
  'rejected',
] as const;

export class ListSavedProgramsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by program status' })
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_STATUSES)
  status?: string;

  @ApiPropertyOptional({ default: 0, description: 'Page number (0-indexed)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ default: 20, description: 'Results per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;
}
