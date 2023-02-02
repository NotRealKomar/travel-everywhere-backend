import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AutocompleteModel } from '../../models/AutocompleteModel';
import { PlacesUrlService, PlacesUrlType } from '../PlacesUrlService';

@Injectable()
export class AutocompleteService {
  constructor(private readonly placesUrlService: PlacesUrlService) {}

  async getAutocomplete(value: string): Promise<AutocompleteModel[]> {
    const cityLevelValues = await this.getItemsByAddressLevel(value, 'city');
    const amenityLevelValues = await this.getItemsByAddressLevel(
      value,
      'amenity',
    );

    return [...cityLevelValues, ...amenityLevelValues];
  }

  private async getItemsByAddressLevel(
    value: string,
    addressLevel: 'city' | 'amenity',
  ): Promise<AutocompleteModel[]> {
    const url = this.placesUrlService.getPlacesUrl(PlacesUrlType.AUTOCOMPLETE);

    url.searchParams.append('text', value);
    url.searchParams.append('filter', 'countrycode:by');
    url.searchParams.append('type', addressLevel);
    url.searchParams.append('limit', addressLevel === 'amenity' ? '5' : '2');

    const response = await axios.get(url.toString());

    return AutocompleteModel.createManyFromResponse(response.data.features);
  }
}
