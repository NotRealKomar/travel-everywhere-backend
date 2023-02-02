import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Document, Types, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

type CreateArgs = {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly id?: Types.ObjectId;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  readonly _id: Types.ObjectId;

  @Prop()
  readonly firstName: string;

  @Prop()
  readonly lastName: string;

  @Prop()
  readonly email: string;

  @Prop()
  readonly password: string;

  constructor({
    email,
    firstName,
    lastName,
    password,
    id = new Types.ObjectId(randomBytes(12)),
  }: CreateArgs) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;

    this._id = id;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaModel = {
  name: 'user',
  schema: UserSchema,
};
