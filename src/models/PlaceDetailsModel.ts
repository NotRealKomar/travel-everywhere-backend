type PlaceDetailsData = {
  properties: PlaceDetailsModel;
};

type CreateArgs = {
  readonly address_line1: string;
  readonly address_line2: string;
  readonly formatted: string;
  readonly city: string;
};

export class PlaceDetailsModel {
  readonly address_line1: string;

  readonly address_line2: string;

  readonly formatted: string;

  readonly city: string;

  constructor(args: CreateArgs) {
    this.address_line1 = args.address_line1;
    this.address_line2 = args.address_line2;
    this.formatted = args.formatted;
    this.city = args.city;
  }

  static createManyFromResponse(data: PlaceDetailsData[]) {
    if (data.length === 0) {
      return [];
    }

    return data.map(
      (value: PlaceDetailsData) => new PlaceDetailsModel(value.properties),
    );
  }
}
