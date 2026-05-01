import { IsIn, IsOptional, IsString } from 'class-validator';

const ALLOWED_STATUSES = [
  'interested',
  'applying',
  'applied',
  'accepted',
  'rejected',
] as const;

export class ListSavedProgramsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_STATUSES)
  status?: string;
}
