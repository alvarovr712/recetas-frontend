export interface RecipeCard {
  id: string;
  image: string;
  title: string;
  description: string;
  type: string;

  category?: string;
  rating?: number;
  isFavorite?: boolean;
}
