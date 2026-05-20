import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // TEMP: disabled for testing
// import { RolesGuard } from '../../common/guards/roles.guard'; // TEMP: disabled for testing
// import { Roles } from '../../common/decorators/roles.decorator'; // TEMP: disabled for testing
import { SyncService } from './sync.service';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('run')
  @HttpCode(HttpStatus.ACCEPTED)
  // @UseGuards(JwtAuthGuard, RolesGuard) // TEMP: disabled for testing
  // @Roles(['ADMIN']) // TEMP: disabled for testing
  async run(): Promise<{ message: string }> {
    // Fire-and-forget: start sync without awaiting
    void this.syncService.syncAll().catch((err) => {
      console.error('Background sync failed:', err);
    });
    return { message: 'Sync started' };
  }
}
