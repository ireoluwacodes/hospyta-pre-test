import { IsNotEmpty, IsIn, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsUrl()
  bannerImage: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsIn(['kidney', 'headache', 'stomachpain', 'legpain', 'malaria', 'typhoid'])
  category: string;
}
