import { IsNotEmpty, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  bannerImage: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsIn(['kidney', 'headache', 'stomachpain', 'legpain', 'malaria', 'typhoid'])
  category: string;
}
