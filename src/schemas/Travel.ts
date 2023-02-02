import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Document, Types, SchemaTypes } from 'mongoose';
import { WaypointData, WaypointDataSchema } from './partial/WaypointData';
import { DateRange } from './partial/DateRange';
import { PathData } from './partial/PathData';

export type TravelDocument = Travel & Document;

type CreateArgs = {
  readonly dates: DateRange;
  readonly title: string;
  readonly waypoints: WaypointData[];
  readonly userId: string;
  readonly isPublic: boolean;
  readonly id?: Types.ObjectId;
};

@Schema({ timestamps: true })
export class Travel {
  @Prop({ type: SchemaTypes.ObjectId })
  readonly _id: Types.ObjectId;

  @Prop({
    type: DateRange,
  })
  readonly dates: DateRange;

  @Prop()
  readonly title: string;

  @Prop({
    type: PathData,
  })
  path: PathData;

  @Prop({
    type: [WaypointDataSchema],
  })
  readonly waypoints: WaypointData[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  readonly userId: string;

  @Prop({
    type: SchemaTypes.Boolean,
  })
  readonly isPublic: boolean;

  constructor({
    title,
    dates,
    userId,
    waypoints,
    isPublic,
    id = new Types.ObjectId(randomBytes(12)),
  }: CreateArgs) {
    this.title = title;
    this.dates = {
      startDate: new Date(dates.startDate),
      endDate: new Date(dates.endDate),
    };
    this.waypoints = waypoints;
    this.isPublic = isPublic;

    this._id = id;
    this.userId = userId;
  }
}

export const TravelSchema = SchemaFactory.createForClass(Travel);
export const TravelSchemaModel = {
  name: 'travel',
  schema: TravelSchema,
};
