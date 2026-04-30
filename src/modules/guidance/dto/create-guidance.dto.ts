import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { GuidanceSectionDto } from './guidance-section.dto';

export class CreateGuidanceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuidanceSectionDto)
  sections: GuidanceSectionDto[];
}
