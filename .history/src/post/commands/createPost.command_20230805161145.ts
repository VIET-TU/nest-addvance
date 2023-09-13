import { User } from 'src/user/models/user.model';
import { CreatePostDto } from '../dto/post.dto';

export class createPostCommand {
  constructor(
    public readonly User: User,
    public readonly createPostDto: CreatePostDto,
  ) {}
}
