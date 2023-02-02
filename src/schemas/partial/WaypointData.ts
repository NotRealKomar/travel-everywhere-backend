import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export type WaypointDataDocument = WaypointData & Document;

type CreateArgs = {
  readonly lon: number;
  readonly lat: number;
  readonly label?: string;
  readonly placeId?: string;
};

@Schema({ _id: false })
export class WaypointData {
  @Prop({ type: SchemaTypes.Number })
  readonly lon: number;

  @Prop({ type: SchemaTypes.Number })
  readonly lat: number;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  readonly label?: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
  })
  readonly placeId?: string;

  constructor({ lon, lat, label, placeId }: CreateArgs) {
    this.lon = lon;
    this.lat = lat;
    this.label = label;
    this.placeId = placeId;
  }
}

export const WaypointDataSchema = SchemaFactory.createForClass(WaypointData);
