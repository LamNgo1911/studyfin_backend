import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';

const mockHttpService = {
  get: jest.fn(),
};

describe('UniversitiesModule', () => {
  let controller: UniversitiesController;
  let service: UniversitiesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversitiesController],
      providers: [
        UniversitiesService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    controller = module.get<UniversitiesController>(UniversitiesController);
    service = module.get<UniversitiesService>(UniversitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
