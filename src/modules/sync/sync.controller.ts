import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('run')
  @HttpCode(HttpStatus.ACCEPTED)
  async run(): Promise<{ message: string }> {
    // Fire-and-forget: start sync without awaiting
    void this.syncService.syncAll();
    return { message: 'Sync started' };
  }
}
