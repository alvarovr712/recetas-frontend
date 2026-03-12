export interface UpdateUserDto {
  name?: string;
  surnames?: string;
  email?: string;
  username?: string;
  password?: string;
  image?: File | null;
}
