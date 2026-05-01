import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Registered email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
