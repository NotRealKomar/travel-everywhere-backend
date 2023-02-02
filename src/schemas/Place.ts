import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Document, Types, SchemaTypes } from 'mongoose';
import { PlaceDetailsData } from '../dto/partials/PlaceDetailsData';
import { CoordinatesData } from '../dto/partials/CoordinatesData';
import { PlaceType } from '../enums/PlaceType';

export type PlaceDocument = Place & Document;

type CreateArgs = {
  readonly title: string;
  readonly description: string;
  readonly coordinates: CoordinatesData;
  readonly type: PlaceType;
  readonly userId: string;
  readonly isPublic: boolean;
  readonly id?: Types.ObjectId;
};

@Schema({ timestamps: true })
export class Place {
  @Prop({ type: SchemaTypes.ObjectId })
  readonly _id: Types.ObjectId;

  @Prop({
    type: CoordinatesData,
  })
  readonly coordinates: CoordinatesData;

  @Prop()
  readonly title: string;

  @Prop()
  readonly description: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  readonly userId: string;

  @Prop({ type: SchemaTypes.String, enum: PlaceType })
  readonly type: PlaceType;

  @Prop({
    type: SchemaTypes.Boolean,
  })
  readonly isPublic: boolean;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({
    type: PlaceDetailsData,
  })
  details: PlaceDetailsData | null;

  constructor({
    title,
    description,
    coordinates,
    type,
    userId,
    isPublic,
    id = new Types.ObjectId(randomBytes(12)),
  }: CreateArgs) {
    this.title = title;
    this.description = description;
    this.coordinates = coordinates;
    this.type = type;
    this.isPublic = isPublic;

    this._id = id;
    this.userId = userId;
  }
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
export const PlaceSchemaModel = {
  name: 'place',
  schema: PlaceSchema,
};
