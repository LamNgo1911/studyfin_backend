import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { GuidanceSectionDto } from './guidance-section.dto';

export class CreateGuidanceDto {
  @ApiProperty({ type: [GuidanceSectionDto], description: 'Guidance sections to create/replace' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuidanceSectionDto)
  sections: GuidanceSectionDto[];
}
