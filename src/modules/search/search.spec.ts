import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BadGatewayException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(SearchService);
    httpService = module.get(HttpService);
  });

  it('should transform upstream response correctly', async () => {
    const upstreamResponse = {
      data: {
        total: 1,
        hits: [
          {
            oid: '1.2.246.562.10.56753942459',
            nimi: { fi: 'Aalto-yliopisto', en: 'Aalto University', sv: 'Aalto-universitetet' },
            kuvaus: { en: 'A great university', fi: 'Hieno yliopisto' },
            logo: 'https://example.com/logo.png',
            paikkakunnat: [
              { koodiUri: 'kunta_091', nimi: { fi: 'Helsinki', en: 'Helsinki' } },
            ],
            kielivalinta: ['fi', 'sv', 'en'],
            koulutusohjelmatLkm: {
              kaikki: 163,
              tutkintoonJohtavat: 159,
              eiTutkintoonJohtavat: 4,
            },
          },
        ],
      },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(upstreamResponse));

    const result = await service.searchInstitutions({
      keyword: 'aalto',
      lng: 'en',
      size: 20,
      page: 0,
    });

    expect(result.total).toBe(1);
    expect(result.page).toBe(0);
    expect(result.size).toBe(20);
    expect(result.hits).toHaveLength(1);

    const hit = result.hits[0];
    expect(hit.oid).toBe('1.2.246.562.10.56753942459');
    expect(hit.name).toBe('Aalto University');
    expect(hit.description).toBe('A great university');
    expect(hit.logoUrl).toBe('https://example.com/logo.png');
    expect(hit.locations).toEqual([{ code: 'kunta_091', name: 'Helsinki' }]);
    expect(hit.languages).toEqual(['fi', 'sv', 'en']);
    expect(hit.programCount).toEqual({
      total: 163,
      degreeProgrammes: 159,
      nonDegree: 4,
    });
  });

  it('should throw BadGatewayException on upstream failure', async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      throwError(() => new Error('Network error')),
    );

    await expect(
      service.searchInstitutions({ lng: 'en', size: 20, page: 0 }),
    ).rejects.toThrow(BadGatewayException);
  });

  it('should pass keyword param only when provided', async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      of({ data: { total: 0, hits: [] } }),
    );

    await service.searchInstitutions({ lng: 'fi', size: 10, page: 0 });

    const callArgs = (httpService.get as jest.Mock).mock.calls[0];
    expect(callArgs[1].params.keyword).toBeUndefined();
    expect(callArgs[1].params.koulutustyyppi).toBe('yo,amk');
  });
});
