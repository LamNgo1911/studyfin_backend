import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  keyword?: string;

  @IsOptional()
  @IsIn(['fi', 'sv', 'en'])
  lng?: string = 'en';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  size?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}

export class DbSearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string = '';

  @IsOptional()
  @IsIn(['institutions', 'programs'])
  type?: 'institutions' | 'programs' = 'programs';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}
