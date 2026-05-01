import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';

@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: RegisterDto,
  ) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  verifyEmail(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('login')
  login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return user;
  }
}
