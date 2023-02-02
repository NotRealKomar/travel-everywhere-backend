import { Injectable } from '@nestjs/common';
import { PlaceService } from '../services/place/PlaceService';
import { DestinationModel } from '../models/DestinationModel';
import { TravelDetailsModel } from '../models/TravelDetailsModel';
import { Travel } from '../schemas/Travel';
import { format } from 'date-fns';

@Injectable()
export class TravelDetailsModelConverter {
  constructor(private readonly placeService: PlaceService) {}

  async convertToModel(travel: Travel): Promise<TravelDetailsModel> {
    const destinations = await Promise.all(
      travel.waypoints.map(async (destination) => {
        if (destination.placeId !== null && destination.placeId !== undefined) {
          const place = await this.placeService.getOneById(destination.placeId);

          return new DestinationModel({
            city: place.details ? place.details.city : '',
            formattedAddress: place.details ? place.details.formatted : '',
            title: place.title,
            type: place.type,
            lat: place.coordinates.lat,
            lon: place.coordinates.lng,
          });
        }

        return new DestinationModel({
          formattedAddress: destination.label,
          lat: destination.lat,
          lon: destination.lon,
        });
      }),
    );

    return new TravelDetailsModel({
      id: travel._id.toString(),
      title: travel.title,
      destinations,
      startDate: format(new Date(travel.dates.startDate), 'dd-MM-yyyy'),
      endDate: format(new Date(travel.dates.endDate), 'dd-MM-yyyy'),
      isPublic: travel.isPublic,
      userId: travel.userId,
      routeData: travel.path,
    });
  }
}
