import { Controller, Get, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.universitiesService.findAll(query);
  }
}
