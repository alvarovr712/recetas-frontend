export interface RecipeDetailDto {
  id: string;
  image: string;
  title: string;
  type: string;
  prepTime: number;
  servings: number;
  description: string;

  userName: string;
  userImage: string;

  ingredients: RecipeIngredientDto[];
  steps: RecipeStepDto[];
  isFavorite: boolean;
}

export interface RecipeIngredientDto {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeStepDto {
  stepOrder: number;
  instruction: string;
  image: string;
}
