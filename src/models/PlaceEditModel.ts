import { Place } from '../schemas/Place';
import { CoordinatesData } from '../dto/partials/CoordinatesData';
import { PlaceType } from '../enums/PlaceType';

type CreateArgs = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly type: PlaceType;
  readonly coordinates: CoordinatesData;
  readonly isPublic: boolean;
};

export class PlaceEditModel {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly type: PlaceType;

  readonly coordinates: CoordinatesData;

  readonly isPublic: boolean;

  constructor({
    coordinates,
    description,
    id,
    title,
    type,
    isPublic,
  }: CreateArgs) {
    this.id = id;
    this.coordinates = coordinates;
    this.description = description;
    this.title = title;
    this.type = type;
    this.isPublic = isPublic;
  }

  static createFromEntity(place: Place): PlaceEditModel {
    return new this({
      id: place._id.toString(),
      coordinates: place.coordinates,
      description: place.description,
      title: place.title,
      type: place.type,
      isPublic: place.isPublic,
    });
  }
}
