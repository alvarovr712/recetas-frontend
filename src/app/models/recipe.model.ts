export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];  
  steps: string[];        
  prepTime: number;
  servings: number;
  image: string;
}
