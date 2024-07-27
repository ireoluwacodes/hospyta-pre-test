import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

// comment schema
@Schema()
export class Comment {
  [x: string]: any;
  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  postedBy: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }])
  replies: Comment[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// category schema
// @Schema()
// export class Category {
//   [x: string]: any;
//   @Prop()
//   name: string;
// }

// export const CategorySchema = SchemaFactory.createForClass(Category);

// Post schema
@Schema({ timestamps: true })
export class Post {
  [x: string]: any;
  @Prop()
  bannerImage: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  postedBy: string;

  @Prop()
  content: string;

  @Prop({
    enum: [
      'kidney',
      'headache',
      'stomachpain',
      'legpain',
      'malaria',
      'typhoid',
    ],
    required: true,
  })
  category: string;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }])
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
