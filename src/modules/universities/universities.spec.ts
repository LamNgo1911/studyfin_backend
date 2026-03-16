import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';

describe('UniversitiesModule', () => {
  let controller: UniversitiesController;
  let service: UniversitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversitiesController],
      providers: [UniversitiesService],
    }).compile();

    controller = module.get<UniversitiesController>(UniversitiesController);
    service = module.get<UniversitiesService>(UniversitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
