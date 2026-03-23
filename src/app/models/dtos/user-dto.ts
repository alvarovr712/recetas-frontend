export interface UserDto {
  id: string;
  name: string;
  surnames: string;
  email: string;
  username: string;
  createdAt: string;
  image: string | null;
  role: string;
  enabled: boolean;
}
