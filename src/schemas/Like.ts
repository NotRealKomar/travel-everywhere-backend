import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Document, Types, SchemaTypes } from 'mongoose';

export type LikeDocument = Like & Document;

type CreateArgs = {
  readonly userId: string;
  readonly placeId: string | null;
  readonly travelId: string | null;
  readonly id?: Types.ObjectId;
};

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: SchemaTypes.ObjectId })
  readonly _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  readonly userId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Place',
    required: false,
  })
  readonly placeId: string | null;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Travel',
    required: false,
  })
  readonly travelId: string | null;

  constructor({
    userId,
    placeId = null,
    travelId = null,
    id = new Types.ObjectId(randomBytes(12)),
  }: CreateArgs) {
    this.userId = userId;
    this.placeId = placeId;
    this.travelId = travelId;

    this._id = id;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);
export const LikeSchemaModel = {
  name: 'like',
  schema: LikeSchema,
};
