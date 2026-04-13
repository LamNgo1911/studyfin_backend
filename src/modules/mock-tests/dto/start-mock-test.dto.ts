import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StartMockTestDto {
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @IsOptional()
  @IsString()
  programId?: string;
}
