import { IsBoolean } from 'class-validator';

export class ToggleMockTestAccessDto {
  @IsBoolean()
  hasTestAccess: boolean;
}
