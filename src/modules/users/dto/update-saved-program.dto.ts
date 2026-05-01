import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const ALLOWED_STATUSES = [
  'interested',
  'applying',
  'applied',
  'accepted',
  'rejected',
] as const;

export class UpdateSavedProgramDto {
  @ApiProperty({ description: 'New status for the saved program' })
  @IsString()
  @IsIn(ALLOWED_STATUSES)
  status: string;
}
