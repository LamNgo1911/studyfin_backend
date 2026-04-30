import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class GuidanceSectionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsInt()
  @Min(0)
  order: number;
}
