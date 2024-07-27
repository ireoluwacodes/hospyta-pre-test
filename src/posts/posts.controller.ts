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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProtectedRequest } from 'src/auth/interfaces/request.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(
    @Req() request: ProtectedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    const { sub } = request.user;
    return this.postsService.create(sub, createPostDto);
  }

  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  update(
    @Req() request: ProtectedRequest,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { sub } = request.user;
    return this.postsService.update(sub, id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  remove(@Req() request: ProtectedRequest, @Param('id') id: string) {
    const { sub } = request.user;
    return this.postsService.remove(sub, id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getAllPostsByUser(@Req() request: ProtectedRequest) {
    const { sub } = request.user;
    return this.postsService.findMyPosts(sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
}
