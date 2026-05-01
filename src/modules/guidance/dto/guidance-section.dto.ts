import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class GuidanceSectionDto {
  @ApiProperty({ description: 'Unique section key (e.g. application, visa, housing)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Section title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Section body content (markdown)' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ description: 'Display order (ascending)' })
  @IsInt()
  @Min(0)
  order: number;
}
