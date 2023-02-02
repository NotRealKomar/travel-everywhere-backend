import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PlacesApiVersion,
  PlacesUrlService,
  PlacesUrlType,
} from '../../services/PlacesUrlService';
import { Place, PlaceDocument, PlaceSchemaModel } from '../../schemas/Place';
import { CoordinatesData } from '../../dto/partials/CoordinatesData';
import { PlaceDetailsModel } from '../../models/PlaceDetailsModel';
import axios from 'axios';

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(PlaceSchemaModel.name)
    private readonly placeModel: Model<PlaceDocument>,
    private readonly placesUrlService: PlacesUrlService,
  ) {}

  async save(place: Place): Promise<boolean> {
    place.details = await this.getFullAddress(place.coordinates);

    const response = await this.placeModel.create(place);

    if (!response) {
      return false;
    }

    return true;
  }

  async getOneById(id: string): Promise<Place> {
    const place = await this.placeModel.findById(id);

    if (place === null || place === undefined) {
      throw new Error(`Cannot find place with id #${id}`);
    }

    return place as Place;
  }

  async findManyByUser(
    userId: string,
    searchQuery?: string | null,
  ): Promise<Place[]> {
    const places =
      searchQuery === null || searchQuery === undefined
        ? await this.placeModel.find({ userId }).sort({ createdAt: 'desc' })
        : await this.placeModel
            .find({
              $and: [
                { userId },
                { title: { $regex: `.*${searchQuery}.*`, $options: 'i' } },
              ],
            })
            .sort({ createdAt: 'desc' });

    return places;
  }

  async findManyPublic(userId: string): Promise<Place[]> {
    const places = await this.placeModel
      .find({ $and: [{ isPublic: true }, { userId: { $ne: userId } }] })
      .sort({ createdAt: 'asc' })
      .limit(5);

    return places;
  }

  async edit(place: Place): Promise<boolean> {
    place.details = await this.getFullAddress(place.coordinates);

    const response = await this.placeModel.findByIdAndUpdate(place._id, place);

    if (!response) {
      return false;
    }

    return true;
  }

  private async getFullAddress(
    data: CoordinatesData,
  ): Promise<PlaceDetailsModel | null> {
    const url = this.placesUrlService.getPlacesUrl(
      PlacesUrlType.PLACE_DETAILS,
      PlacesApiVersion.V2,
    );

    url.searchParams.append('lat', data.lat.toString());
    url.searchParams.append('lon', data.lng.toString());

    const response = await axios.get(url.toString());

    if (
      response.data.features === undefined ||
      response.data.features.length === 0
    ) {
      return null;
    }

    return PlaceDetailsModel.createManyFromResponse(
      response.data.features,
    ).pop();
  }
}
