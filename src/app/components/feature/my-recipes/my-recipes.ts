import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { IngredientService } from '../../../services/ingredient.service';
import { Ingredient } from '../../../models/ingredient.model';

interface RecipeStep {
  id: number;
  instruction: string;
  image?: string;
}

interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeGrid],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes implements OnInit {
  private ingredientService = inject(IngredientService);
  
  availableIngredients: Ingredient[] = [];
  myRecipes = [
    {
      id: 1,
      title: 'Paella de Marisco',
      category: 'Plato Principal',
      type: 'TRADICIONAL',
      description: 'Mi versión especial de la paella valenciana.',
      rating: 4.8,
      image: 'recipes/paella.png',
      isFavorite: true
    }
  ];

  ngOnInit() {
    this.ingredientService.buscarTodos().subscribe({
      next: (data) => {
        this.availableIngredients = data;
      },
      error: (err) => {
        console.error('Error al cargar ingredientes', err);
      }
    });
  }

  // Modal Logic
  isModalOpen = false;
  
  newIngredientName = '';
  newIngredientQty = '';
  newIngredientUnit = 'unidad';
  
  units = ['pizca', 'gramos', 'ml', 'litros', 'cucharadas', 'tazas', 'unidad'];

  newRecipe = {
    title: '',
    category: '',
    ingredients: [] as RecipeIngredient[],
    description: '',
    steps: [{ id: 1, instruction: '' }] as RecipeStep[]
  };

  categories = ['Todo', 'Desayuno', 'Plato Principal', 'Postres', 'Snacks'];

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  addIngredient(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.newIngredientName.trim() !== '') {
      
      const ingredientToAdd: RecipeIngredient = {
        name: this.newIngredientName.trim(),
        quantity: this.newIngredientQty.trim(),
        unit: this.newIngredientUnit
      };

      this.newRecipe.ingredients.push(ingredientToAdd);
      
      this.newIngredientName = '';
      this.newIngredientQty = '';
      this.newIngredientUnit = 'unidad';
    }
  }

  removeIngredient(index: number) {
    this.newRecipe.ingredients.splice(index, 1);
  }

  addStep() {
    const nextId = this.newRecipe.steps.length > 0 
      ? Math.max(...this.newRecipe.steps.map(s => s.id)) + 1 
      : 1;
    this.newRecipe.steps.push({ id: nextId, instruction: '' });
  }

  removeStep(index: number) {
    this.newRecipe.steps.splice(index, 1);
  }

  saveRecipe() {
    console.log('Recipe saved:', this.newRecipe);
    this.closeModal();
  }
}
