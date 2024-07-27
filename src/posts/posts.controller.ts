import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProtectedRequest } from 'src/auth/interfaces/request.interface';
import { CreateCommentDto } from './dto/create.comment.dto';
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  create(
    @Req() request: ProtectedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    const { sub } = request.user;
    return this.postsService.create(sub, createPostDto);
  }

  @Patch('edit/:id')
  update(
    @Req() request: ProtectedRequest,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { sub } = request.user;
    return this.postsService.update(sub, id, updatePostDto);
  }

  @Delete('delete/:id')
  remove(@Req() request: ProtectedRequest, @Param('id') id: string) {
    const { sub } = request.user;
    return this.postsService.remove(sub, id);
  }

  @Get('me')
  getAllPostsByUser(@Req() request: ProtectedRequest) {
    const { sub } = request.user;
    return this.postsService.findMyPosts(sub);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.postsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post('comments/:id')
  createComment(
    @Param('id') id: string,
    @Req() request: ProtectedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const { sub } = request.user;
    return this.postsService.addCommentToPost(
      sub,
      id,
      createCommentDto.content,
    );
  }

  @Post('comments/reply/:postId/:commentId')
  replyComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() request: ProtectedRequest,
    @Body() replyCommentDto: CreateCommentDto,
  ) {
    const { sub } = request.user;
    return this.postsService.replyComment(
      sub,
      commentId,
      postId,
      replyCommentDto.content,
    );
  }

  @Get('comments/:id')
  getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @Get('comments/replies/:postId/:commentId')
  getReplies(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.postsService.getReplies(postId, commentId);
  }

  @Post('upvote/:id')
  upvotePost(@Param('id') id: string, @Req() request: ProtectedRequest) {
    const { sub } = request.user;
    return this.postsService.upvotePost(sub, id);
  }

  @Post('downvote/:id')
  downvotePost(@Param('id') id: string, @Req() request: ProtectedRequest) {
    const { sub } = request.user;
    return this.postsService.downvotePost(sub, id);
  }
}
