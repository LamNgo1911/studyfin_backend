import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.universitiesService.findAll(query);
  }

  @Get(':oid')
  findOne(@Param('oid') oid: string, @Query('lng') lng?: string) {
    return this.universitiesService.findOne(oid, lng);
  }

  @Get(':oid/programs')
  findPrograms(@Param('oid') oid: string, @Query() query: Record<string, any>) {
    return this.universitiesService.findPrograms(oid, query);
  }
}
