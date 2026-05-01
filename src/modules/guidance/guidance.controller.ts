import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GuidanceService } from './guidance.service';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';

@ApiTags('Guidance')
@Controller('guidance')
export class GuidanceController {
  constructor(private readonly guidanceService: GuidanceService) {}

  @Get(':programOid')
  findByProgramOid(@Param('programOid') programOid: string) {
    return this.guidanceService.findByProgramOid(programOid);
  }

  @Post(':programOid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(
    @Param('programOid') programOid: string,
    @Body() dto: CreateGuidanceDto,
  ) {
    return this.guidanceService.upsert(programOid, dto);
  }

  @Patch(':programOid')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  patch(
    @Param('programOid') programOid: string,
    @Body() dto: UpdateGuidanceDto,
  ) {
    return this.guidanceService.patch(programOid, dto);
  }
}
