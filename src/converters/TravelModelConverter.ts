import { Injectable } from '@nestjs/common';
import { Travel } from '../schemas/Travel';
import { TravelModel } from '../models/TravelModel';
import { PlaceService } from '../services/place/PlaceService';
import { format } from 'date-fns';

@Injectable()
export class TravelModelConverter {
  constructor(private readonly placeService: PlaceService) {}

  async convertManyToModel(travels: Travel[]): Promise<TravelModel[]> {
    return Promise.all(
      travels.map(async (travel) => this.convertToModel(travel)),
    );
  }

  async convertToModel(travel: Travel): Promise<TravelModel> {
    const destinations = await Promise.all(
      travel.waypoints.map(async (destination) => {
        if (destination.placeId !== null && destination.placeId !== undefined) {
          const place = await this.placeService.getOneById(destination.placeId);

          return place.details ? place.details.formatted : '';
        }

        return destination.label;
      }),
    );

    return new TravelModel({
      id: travel._id.toString(),
      title: travel.title,
      destinations,
      startDate: format(new Date(travel.dates.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(travel.dates.endDate), 'dd-MM-yyyy'),
      isPublic: travel.isPublic,
      userId: travel.userId,
    });
  }
}
