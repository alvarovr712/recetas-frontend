import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { RecipeCard } from '../../../models/dtos/recipe-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoriteRecipes:RecipeCard[] = [];
}
