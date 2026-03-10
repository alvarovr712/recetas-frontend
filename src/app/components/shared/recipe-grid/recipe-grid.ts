import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCard } from '../../../models/dtos/recipe-card';

interface Recipe {
  id: number;
  title: string;
  category: string;
  description: string;
  rating: number;
  image: string;
  isFavorite: boolean;
  type: string;
}

@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-grid.html',
  styleUrl: './recipe-grid.css',
})
export class RecipeGrid {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() recipes: RecipeCard[] = [];

  categories = ['Todo', 'Desayuno', 'Plato Principal', 'Postres', 'Snacks'];
  selectedCategory = 'Todo';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredRecipes() {
    if (this.selectedCategory === 'Todo') {
      return this.recipes;
    }
    return this.recipes.filter(r => r.category === this.selectedCategory);
  }
}
