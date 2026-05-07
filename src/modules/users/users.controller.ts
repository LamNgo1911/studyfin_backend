import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSavedProgramDto } from './dto/update-saved-program.dto';
import { ListSavedProgramsQueryDto } from './dto/list-saved-programs-query.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/programs/:programId')
  @UseGuards(JwtAuthGuard)
  saveProgram(
    @CurrentUser() user: CurrentUserData,
    @Param('programId') programId: string,
  ) {
    return this.usersService.saveProgram(user.id, programId);
  }

  @Patch('me/programs/:programId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  updateSavedProgramStatus(
    @CurrentUser() user: CurrentUserData,
    @Param('programId') programId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateSavedProgramDto,
  ) {
    return this.usersService.updateSavedProgramStatus(user.id, programId, dto);
  }

  @Delete('me/programs/:programId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  removeSavedProgram(
    @CurrentUser() user: CurrentUserData,
    @Param('programId') programId: string,
  ) {
    return this.usersService.removeSavedProgram(user.id, programId);
  }

  @Get('me/programs')
  @UseGuards(JwtAuthGuard)
  listSavedPrograms(
    @CurrentUser() user: CurrentUserData,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ListSavedProgramsQueryDto,
  ) {
    return this.usersService.listSavedPrograms(user.id, query);
  }
}
