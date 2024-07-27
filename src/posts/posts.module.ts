import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  // Category,
  // CategorySchema,
  Comment,
  CommentSchema,
  Post,
  PostSchema,
} from './schemas/post.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      // { name: Category.name, schema: CategorySchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
