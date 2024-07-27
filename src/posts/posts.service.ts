import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(Category.name) private castegoryModel: Model<Category>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(sub: string, createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create({
      ...createPostDto,
      postedBy: sub,
    });
    await this.userModel.findByIdAndUpdate(sub, { $push: { posts: post._id } });
    return post;
  }

  async update(
    sub: string,
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    let post = await this.postModel.findById(id).lean();
    if (!post || post.postedBy != sub)
      throw new ForbiddenException('Invalid post');
    post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .lean();
    return post;
  }

  async remove(sub: string, id: string) {
    const post = await this.postModel.findById(id).lean();
    if (!post || post.postedBy != sub)
      throw new ForbiddenException('Invalid post');
    await this.postModel.findByIdAndDelete(id).lean();
    return 'deleted';
  }

  async findMyPosts(sub: string) {
    const posts = await this.userModel.findById(sub).populate('posts');
    return posts;
  }

  async findAll() {
    return `This action returns all posts`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }
}
