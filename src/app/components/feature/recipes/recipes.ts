import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent implements OnInit {

  recipes = [
    {
      id: 1,
      title: 'Paella de Marisco',
      category: 'Plato Principal',
      type: 'TRADICIONAL',
      description: 'Un clásico valenciano con ingredientes frescos de la...',
      rating: 4.8,
      image: 'recipes/paella.png',
      isFavorite: true
    },
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
      id: 3,
      title: 'Ensalada César',
      category: 'Plato Principal',
      type: 'ENSALADAS',
      description: 'Frescura y sabor en cada bocado con aderezo casero.',
      rating: 4.5,
      image: 'recipes/ensalada.png',
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
    },
    {
      id: 5,
      title: 'Salmón al Grill',
      category: 'Plato Principal',
      type: 'SALUDABLE',
      description: 'Filete fresco acompañado de vegetales de temporada.',
      rating: 4.7,
      image: 'recipes/salmon.png',
      isFavorite: true
    },
    {
      id: 6,
      title: 'Pizza Margherita',
      category: 'Plato Principal',
      type: 'ITALIANA',
      description: 'Masa madre artesanal, albahaca fresca y mozzarella...',
      rating: 4.9,
      image: 'recipes/pizza.png',
      isFavorite: true
    }
  ];

  ngOnInit(): void { }
}
