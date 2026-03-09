import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoriteRecipes = [
    {
      id: 2,
      title: 'Tacos al Pastor',
      category: 'Plato Principal',
      type: 'MEXICANA',
      description: 'Auténtico sabor mexicano marinado con especias y piña.',
      rating: 4.9,
      image: 'recipes/tacos.png',
      isFavorite: true
    },
    {
      id: 4,
      title: 'Brownies de Chocolate',
      category: 'Postres',
      type: 'POSTRES',
      description: 'El postre perfecto para compartir con un centro...',
      rating: 5.0,
      image: 'recipes/brownies.png',
      isFavorite: true
    }
  ];
}
