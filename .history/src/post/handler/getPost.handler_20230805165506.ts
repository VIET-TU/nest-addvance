import { PostRepository } from './../repositories/post.repository';
import { QueryHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetPostQuery } from '../queries/getPost.query';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements ICommandHandler<GetPostQuery> {
  constructor(private postRepository: PostRepository) {}
  execute(command: GetPostQuery): Promise<any> {
    return this.postRepository.findById(command.post_id);
  }
}
