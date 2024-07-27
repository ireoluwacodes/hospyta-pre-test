import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { AtLeastOneField } from './custom-dto-decorator.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @AtLeastOneField({
    message: 'At least one field must be provided',
  })
  static readonly dummyField: any;
}
