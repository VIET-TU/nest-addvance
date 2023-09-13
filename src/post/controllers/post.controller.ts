import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { ExceptionLoggerFilter } from '../../utils/exceptionLogger.filter';
import { HttpExceptionFilter } from '../../utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createPostCommand } from '../commands/createPost.command';
import { Request } from 'express';
import { User } from 'src/user/models/user.model';
import { GetPostQuery } from '../queries/getPost.query';

import {
  CacheInterceptor,
  CACHE_MANAGER,
  CacheTTL,
  CacheKey,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getAllPost() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  // @UseFilters(ExceptionLoggerFilter)
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get(':id/get-with-cache')
  @CacheTTL(60 * 60 * 1000 * 12)
  @CacheKey('events')
  @UseInterceptors(CacheInterceptor)
  async getPostDetailWithCache(@Param('id') id: string) {
    return (await this.postService.getPostById(id)).toJSON();
  }

  @CacheTTL(200 * 10)
  @Get('cache/demo/set-cache')
  async demoSetCache() {
    const list = ['item1', 'item2', 'item3'];
    const key = 'my-list';

    // Set the list in Redis
    await this.cacheManager.set(key, list);

    // Get the list from Redis
    const cachedList = await this.cacheManager.get(key);

    return cachedList;
  }

  @Get('cache/demo/get-cache')
  async demoGetCache() {
    console.log('hello world :>> ');
    return await this.cacheManager.get('vietu');
  }

  @Get(':id/get-by-query')
  @UseFilters(HttpExceptionFilter)
  // @UseFilters(ExceptionLoggerFilter)
  async getDetailByQuery(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createByCommand(@Req() req: Request, @Body() post: CreatePostDto) {
    return this.commandBus.execute(
      new createPostCommand(req.user as User, post),
    );
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user.populate('posts').execPopulate();
    return req.user.posts;
  }

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_ids') category_ids) {
    return await this.postService.getByCategories(category_ids);
  }

  @Get('get/array')
  async getByArray() {
    return this.postService.getByArray();
  }
}
