import { PlaceType } from '../enums/PlaceType';

type CreateArgs = {
  readonly formattedAddress: string;
  readonly city?: string | null;
  readonly title?: string | null;
  readonly type?: PlaceType | null;
  readonly lon: number;
  readonly lat: number;
};

export class DestinationModel {
  readonly formattedAddress: string;

  readonly title: string | null;

  readonly city: string | null;

  readonly type: PlaceType | null;

  readonly lon: number;

  readonly lat: number;

  constructor({
    formattedAddress,
    lat,
    lon,
    city = null,
    title = null,
    type = null,
  }: CreateArgs) {
    this.formattedAddress = formattedAddress;
    this.lon = lon;
    this.lat = lat;

    this.city = city;
    this.title = title;
    this.type = type;
  }
}
