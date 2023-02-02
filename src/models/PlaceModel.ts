import { PlaceDetailsData } from '../dto/partials/PlaceDetailsData';
import { CoordinatesData } from '../dto/partials/CoordinatesData';
import { PlaceType } from '../enums/PlaceType';
import { Place } from '../schemas/Place';

type CreateArgs = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly coordinates: CoordinatesData;
  readonly type: PlaceType;
  readonly createdAt: Date;
  readonly isPublic: boolean;
  readonly details: PlaceDetailsData | null;
};

export class PlaceModel {
  readonly id: string;

  readonly coordinates: CoordinatesData;

  readonly title: string;

  readonly description: string;

  readonly type: PlaceType;

  readonly createdAt: Date;

  readonly isPublic: boolean;

  readonly details: PlaceDetailsData | null;

  constructor({
    id,
    title,
    description,
    coordinates,
    type,
    createdAt,
    details,
    isPublic,
  }: CreateArgs) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.coordinates = coordinates;
    this.type = type;
    this.createdAt = createdAt;
    this.isPublic = isPublic;
    this.details = details;
  }

  static createFromDocument(place: Place): PlaceModel {
    return new this({
      id: place._id.toString(),
      coordinates: place.coordinates,
      description: place.description,
      title: place.title,
      type: place.type,
      createdAt: place.createdAt,
      isPublic: place.isPublic,
      details: place.details ?? {
        formatted: '',
        address_line1: '',
        address_line2: '',
        city: '',
      },
    });
  }

  static createManyFromDocuments(places: Place[]): PlaceModel[] {
    return places.map((place) => this.createFromDocument(place));
  }
}
