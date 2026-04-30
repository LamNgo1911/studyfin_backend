import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
  order: number;
}
