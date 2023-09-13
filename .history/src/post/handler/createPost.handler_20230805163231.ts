import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createPostCommand } from '../commands/createPost.command';
import { PostRepository } from '../repositories/post.repository';

@CommandHandler(createPostCommand)
export class CreateCommandHandler
  implements ICommandHandler<createPostCommand>
{
  constructor(private postRepository: PostRepository) {}
  async execute(command: createPostCommand): Promise<any> {
    command.createPostDto.user = command.user._id;
    return await this.postRepository.create(command.createPostDto);
  }
}
