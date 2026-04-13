import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListTemplatesQueryDto {
  @IsOptional()
  @IsIn(['math', 'language_en', 'reading', 'analytical'])
  subject?: 'math' | 'language_en' | 'reading' | 'analytical';

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
