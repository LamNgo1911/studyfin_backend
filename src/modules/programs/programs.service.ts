import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const OPINTOPOLKU_BASE = 'https://opintopolku.fi/konfo-backend';

@Injectable()
export class ProgramsService {
  constructor(private readonly httpService: HttpService) {}

  async findOne(oid: string, lng: string = 'en') {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/koulutus/${oid}`)
      );
      return this.mapProgramDetails(response.data, lng);
    } catch {
      throw new BadGatewayException(`Upstream Opintopolku API is unreachable for Program OID: ${oid}`);
    }
  }

  private mapProgramDetails(data: any, lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    const metadata = data.metadata ?? {};

    return {
      oid: data.oid,
      name: resolveLang(data.nimi),
      description: resolveLang(metadata.kuvaus),
      type: data.koulutustyyppi,
      isDegree: !!data.johtaaTutkintoon,
      credits: metadata.opintojenLaajuusNumero ?? metadata.opintojenLaajuusNumeroMin ?? null,
      degreeTitles: (metadata.tutkintonimike ?? []).map((t: any) => resolveLang(t.nimi)),
      image: data.teemakuva ?? '',
    };
  }
}
