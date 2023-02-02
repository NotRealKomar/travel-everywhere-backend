type AutocompleteData = {
  properties: AutocompleteModel;
};

type CreateArgs = {
  readonly address_line1: string;
  readonly address_line2: string;
  readonly category: string;
  readonly city: string;
  readonly suburb: string;
  readonly village: string;
  readonly country: string;
  readonly country_code: string;
  readonly formatted: string;
  readonly lat: string;
  readonly lon: string;
  readonly place_id: string;
  readonly result_type: string;
  readonly state: string;
};

export class AutocompleteModel {
  readonly address_line1: string;
  readonly address_line2: string;
  readonly category: string;
  readonly city: string;
  readonly suburb: string;
  readonly village: string;
  readonly country: string;
  readonly country_code: string;
  readonly formatted: string;
  readonly lat: string;
  readonly lon: string;
  readonly place_id: string;
  readonly result_type: string;
  readonly state: string;

  constructor(args: CreateArgs) {
    this.address_line1 = args.address_line1;
    this.address_line2 = args.address_line2;
    this.category = args.category;
    this.city = args.city;
    this.suburb = args.suburb;
    this.village = args.village;
    this.country = args.country;
    this.country_code = args.country_code;
    this.formatted = args.formatted;
    this.lat = args.lat;
    this.lon = args.lon;
    this.place_id = args.place_id;
    this.result_type = args.result_type;
    this.state = args.state;
  }

  static createManyFromResponse(data: AutocompleteData[]) {
    if (data.length === 0) {
      return [];
    }

    return data.map(
      (value: AutocompleteData) => new AutocompleteModel(value.properties),
    );
  }
}
