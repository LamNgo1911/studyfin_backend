import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { GuidanceSectionDto } from './guidance-section.dto';

export class UpdateGuidanceDto {
  @ApiPropertyOptional({ type: [GuidanceSectionDto], description: 'Sections to upsert' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuidanceSectionDto)
  sections?: GuidanceSectionDto[];

  @ApiPropertyOptional({ type: [String], description: 'Section keys to delete' })
  @IsOptional()
  @IsArray()
  deleteKeys?: string[];
}
