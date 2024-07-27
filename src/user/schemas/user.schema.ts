import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  [x: string]: any;
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profileImage: string;

  @Prop()
  refresh_token: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }])
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
