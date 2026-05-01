import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { UnifiedSearchQueryDto } from './dto/search-query.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search keyword' })
  @ApiQuery({ name: 'type', required: false, enum: ['programs', 'institutions'], description: 'Filter by type' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (0-indexed)' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Results per page' })
  search(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: UnifiedSearchQueryDto,
  ) {
    return this.searchService.search(query);
  }
}
