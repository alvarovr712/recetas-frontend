import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { IngredientService } from '../../../services/ingredient.service';
import { Ingredient } from '../../../models/ingredient.model';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  
  availableIngredients: Ingredient[] = [];
  isIngredientNewState = false;
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
    this.loadIngredients().subscribe({
      next: (data) => {
        this.availableIngredients = data;
        this.updateIngredientNewState();
      },
      error: (err) => console.error('Error inicial de carga', err)
    });
  }

  loadIngredients(): Observable<Ingredient[]> {
    return this.ingredientService.buscarTodos();
  }

  // Modal Logic
  isModalOpen = false;
  isCreatingIngredient = false;
  
  newIngredientName = '';
  newIngredientQty = '';
  newIngredientUnit = 'unidad';

  updateIngredientNewState() {
    const name = this.newIngredientName.trim().toLowerCase();
    if (!name || this.isCreatingIngredient) {
      this.isIngredientNewState = false;
      return;
    }
    
    const exists = this.availableIngredients.some(ing => {
      const ingName = (ing.name || (ing as any).nombre || (ing as any).Name || (ing as any).Nombre || '').trim().toLowerCase();
      return ingName === name;
    });
    
    this.isIngredientNewState = !exists;
  }
  
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
      this.updateIngredientNewState();
    }
  }

  createNewIngredient() {
    if (this.newIngredientName.trim() && !this.isCreatingIngredient) {
      this.isCreatingIngredient = true;
      this.ingredientService.crearIngrediente(this.newIngredientName.trim()).subscribe({
        next: () => {
          this.loadIngredients().subscribe({
            next: (data) => {
              // Defer state updates to next tick to avoid NG0100
              setTimeout(() => {
                this.availableIngredients = data;
                this.isCreatingIngredient = false;
                this.updateIngredientNewState();
                this.toastr.success('Ingrediente creado correctamente', 'Éxito');
                // Force detection as we are in a setTimeout
                this.cdr.detectChanges();
              });
            },
            error: (err) => {
              console.error('Error al recargar', err);
              this.isCreatingIngredient = false;
              this.updateIngredientNewState();
              this.cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          console.error('Error al crear ingrediente', err);
          const errorMsg = err.error?.message || err.error || 'No se pudo crear el ingrediente';
          setTimeout(() => {
            this.toastr.error(errorMsg, 'Error');
            this.isCreatingIngredient = false;
            this.updateIngredientNewState();
            this.cdr.detectChanges();
          });
        }
      });
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
