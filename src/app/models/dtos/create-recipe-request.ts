export interface CreateRecipeRequest {
  title: string;
  description: string;
  type: string;
  prepTime: number;
  servings: number;
  image: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }[];
  steps: {
    stepOrder: number;
    instruction: string;
    imageStep: string;
  }[];
}
