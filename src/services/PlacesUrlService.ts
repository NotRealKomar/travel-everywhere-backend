import { Injectable } from '@nestjs/common';

export enum PlacesUrlType {
  AUTOCOMPLETE = 'geocode/autocomplete',
  PLACE_DETAILS = 'place-details',
  ROUTING = 'routing',
}

export enum PlacesApiVersion {
  V2 = 'v2',
  V1 = 'v1',
}

@Injectable()
export class PlacesUrlService {
  getPlacesUrl(
    type: PlacesUrlType,
    version: PlacesApiVersion = PlacesApiVersion.V1,
  ): URL {
    const url = new URL(`${process.env.GEOAPIFY_API_URL}/${version}/${type}`);
    url.searchParams.append('apiKey', process.env.GEOAPIFY_API_KEY);
    url.searchParams.append('lang', 'ru');

    return url;
  }
}
