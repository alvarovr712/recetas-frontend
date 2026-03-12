export interface UserProfileDto {
  name: string;
  surnames: string;
  email: string;
  username: string;
  createdAt: string;   // ISO string
  image?: string | null;
  role: string;
  recipesCreated: number;
}
