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
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_STATUSES)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;
}
