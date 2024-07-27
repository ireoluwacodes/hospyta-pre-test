import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async remove(sub: string, id: string): Promise<string> {
    const post = await this.postModel.findById(id).lean();
    if (!post || post.postedBy != sub)
      throw new ForbiddenException('Invalid post');
    await this.postModel.findByIdAndDelete(id).lean();
    return 'deleted';
  }

  async findMyPosts(sub: string): Promise<Post[]> {
    const userWithPosts = await this.userModel.findById(sub).populate('posts');
    return userWithPosts.posts;
  }

  async findAll(category?: string): Promise<Post[]> {
    const query = category ? { category } : {};
    const posts = await this.postModel.find(query).sort({ upvotes: -1 }).exec();
    return posts;
  }

  async findOne(id: string) {
    const post = await this.postModel.findByIdAndUpdate(id, {}).populate({
      path: 'postedBy',
      select: 'fullName profileImage',
    });
    if (!post) throw new BadRequestException('Post not found');
    return post;
  }

  async addCommentToPost(
    sub: string,
    postId: string,
    content: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentModel.create({
      postedBy: sub,
      content,
    });

    post.comments.push(String(comment._id));
    await post.save();

    return post;
  }

  async replyComment(
    sub: string,
    commentId: string,
    postId: string,
    content: string,
  ): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = await this.commentModel.create({
      postedBy: sub,
      content,
    });

    comment.replies.push(String(reply._id));
    await comment.save();

    return post;
  }

  async getComments(postId: string): Promise<string[]> {
    const post = await this.postModel.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'postedBy',
        select: 'fullName profileImage', // Specify the fields you want to retrieve from the User model
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.comments;
  }

  async getReplies(postId: string, commentId: string): Promise<string[]> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentModel.findById(commentId).populate({
      path: 'replies',
      populate: {
        path: 'postedBy',
        select: 'fullName profileImage',
      },
    });

    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    return comment.replies;
  }

  async upvotePost(sub: string, id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.upvotedBy.includes(sub)) {
      throw new BadRequestException('User has already upvoted this post');
    }

    if (post.downvotedBy.includes(sub)) {
      post.downvotedBy = post.downvotedBy.filter((id) => id !== sub);
      post.downvotes--;
    }

    post.upvotedBy.push(sub);
    post.upvotes++;
    await post.save();
    return post;
  }

  async downvotePost(sub: string, id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.downvotedBy.includes(sub)) {
      throw new BadRequestException('User has already downvoted this post');
    }

    if (post.upvotedBy.includes(sub)) {
      post.upvotedBy = post.upvotedBy.filter((id) => id !== sub);
      post.upvotes--;
    }

    post.downvotedBy.push(sub);
    post.downvotes++;
    await post.save();
    return post;
  }
}
