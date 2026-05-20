import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  // UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // TEMP: disabled for testing
// import { RolesGuard } from '../../common/guards/roles.guard'; // TEMP: disabled for testing
// import { Roles } from '../../common/decorators/roles.decorator'; // TEMP: disabled for testing
import { AdminService } from './admin.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { ToggleMockTestAccessDto } from './dto/toggle-mock-test-access.dto';

@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard) // TEMP: disabled for testing
// @Roles(['ADMIN']) // TEMP: disabled for testing
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Patch('users/:id/mock-test-access')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  toggleMockTestAccess(
    @Param('id') id: string,
    @Body() dto: ToggleMockTestAccessDto,
  ) {
    return this.adminService.toggleMockTestAccess(id, dto);
  }
}
