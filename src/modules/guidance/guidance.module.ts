import { Module } from '@nestjs/common';
// import { Reflector } from '@nestjs/core'; // TEMP: disabled for testing
import { GuidanceController } from './guidance.controller';
import { GuidanceService } from './guidance.service';
// import { RolesGuard } from '../../common/guards/roles.guard'; // TEMP: disabled for testing

@Module({
  imports: [],
  controllers: [GuidanceController],
  providers: [
    GuidanceService,
    // RolesGuard, Reflector, // TEMP: disabled for testing
  ],
  exports: [GuidanceService],
})
export class GuidanceModule {}
