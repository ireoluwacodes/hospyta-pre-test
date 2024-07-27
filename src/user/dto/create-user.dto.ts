export class CreateUserDto {
  email: string;
  password: string;
  profileImage: string;
  hash?: string;
}
