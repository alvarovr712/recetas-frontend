import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { ConfirmModal } from '../../shared/confirm-modal/confirm-modal';
import { IngredientService } from '../../../services/ingredient.service';
import { Ingredient } from '../../../models/ingredient.model';
import { ToastrService } from 'ngx-toastr';
import { CreateRecipeRequest } from '../../../models/dtos/create-recipe-request';
import { RecipeService } from '../../../services/recipe.service';
import { ImageService } from '../../../services/image.service';
import { RecipeCard } from '../../../models/dtos/recipe-card';

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
  imports: [CommonModule, FormsModule, RecipeGrid, ConfirmModal],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes implements OnInit {
  private ingredientService = inject(IngredientService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private recipeService = inject(RecipeService);
  private imageService = inject(ImageService);

  availableIngredients: Ingredient[] = [];
  isIngredientNewState = false;
  recipeImageUrl: string = '';
  myRecipes : RecipeCard[] = [];

  ngOnInit() {
    this.loadIngredients().subscribe({
      next: (data) => {
        this.availableIngredients = data;
        this.updateIngredientNewState();
      },
      error: (err) => console.error('Error inicial de carga', err),
    });
     //Cargar recetas del usuario
     
    this.recipeService.getMisRecetas().subscribe({
    next: (data) => {
      this.myRecipes = data;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error cargando mis recetas', err);
      this.toastr.error('No se pudieron cargar tus recetas');
    }
  });
  }
 


  loadIngredients(): Observable<Ingredient[]> {
    return this.ingredientService.buscarTodos();
  }

  // Modal Logic
  isModalOpen = false;
  isConfirmModalOpen = false;
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

    const exists = this.availableIngredients.some((ing) => {
      const ingName = (
        ing.name ||
        (ing as any).nombre ||
        (ing as any).Name ||
        (ing as any).Nombre ||
        ''
      )
        .trim()
        .toLowerCase();
      return ingName === name;
    });

    this.isIngredientNewState = !exists;
  }

  units = ['pizca', 'gramos', 'ml', 'litros', 'cucharadas', 'tazas', 'unidad'];

  newRecipe = {
    title: '',
    category: '',
    prepTime: 30,
    servings: 4,
    ingredients: [] as RecipeIngredient[],
    description: '',
    steps: [{ id: 1, instruction: '' }] as RecipeStep[],
  };

  categories = ['Desayuno', 'Principal', 'Snacks', 'Postres'];

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.isConfirmModalOpen = false;
    document.body.style.overflow = 'auto';
    // Reset form for next time
    this.newRecipe = {
      title: '',
      category: '',
      prepTime: 30,
      servings: 4,
      ingredients: [],
      description: '',
      steps: [{ id: 1, instruction: '' }],
    };
    this.recipeImageUrl = '';
  }

  addIngredient(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.newIngredientName.trim() !== '') {
      const ingredientToAdd: RecipeIngredient = {
        name: this.newIngredientName.trim(),
        quantity: this.newIngredientQty.trim(),
        unit: this.newIngredientUnit,
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
            },
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
        },
      });
    }
  }

  removeIngredient(index: number) {
    this.newRecipe.ingredients.splice(index, 1);
  }

  addStep() {
    const nextId =
      this.newRecipe.steps.length > 0 ? Math.max(...this.newRecipe.steps.map((s) => s.id)) + 1 : 1;
    this.newRecipe.steps.push({ id: nextId, instruction: '' });
  }

  removeStep(index: number) {
    this.newRecipe.steps.splice(index, 1);
  }

  //SUBIR IMAGENES Y QUE NOS DEVUELVA LA URL

  onRecipeImageSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.imageService.uploadImage(file).subscribe({
    next: (res) => {
      this.recipeImageUrl = res.url;
      this.cdr.detectChanges(); // ← evita NG0100
      this.toastr.success('Imagen subida correctamente');
    },
    error: () => {
      this.toastr.error('Error al subir la imagen');
    },
  });
}

  onStepImageSelected(event: any, step: RecipeStep) {
  const file = event.target.files[0];
  if (!file) return;

  this.imageService.uploadImage(file).subscribe({
    next: (res) => {
      step.image = res.url;
      this.cdr.detectChanges(); // ← evita NG0100
      this.toastr.success('Imagen del paso subida');
    },
    error: () => {
      this.toastr.error('Error al subir imagen del paso');
    },
  });
}

  saveRecipe() {
    if (!this.recipeImageUrl) {
      this.toastr.error('Debes subir una imagen principal');
      return;
    }
    // Show confirm modal instead of sending immediately
    this.isConfirmModalOpen = true;
  }

  confirmSave() {
    this.isConfirmModalOpen = false;

    const dto: CreateRecipeRequest = {
      title: this.newRecipe.title,
      description: this.newRecipe.description,
      type: this.newRecipe.category,
      prepTime: Number(this.newRecipe.prepTime),
      servings: Number(this.newRecipe.servings),
      image: this.recipeImageUrl,
      ingredients: this.newRecipe.ingredients.map((ing) => ({
        ingredientId: this.getIngredientIdByName(ing.name),
        quantity: Number(ing.quantity),
        unit: ing.unit,
      })),
      recipeSteps: this.newRecipe.steps.map((step, index) => ({
        stepOrder: index + 1,
        instruction: step.instruction,
        imageStep: step.image ?? '',
      })),
    };

    this.recipeService.crearReceta(dto).subscribe({
      next: () => {
        setTimeout(() => {
          this.toastr.success('Receta creada correctamente');
          this.closeModal();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
        setTimeout(() => {
          this.toastr.error('Error al crear la receta');
          this.cdr.detectChanges();
        });
      },
    });
  }

  cancelConfirm() {
    // Just close the confirm modal, keep creation modal open with data
    this.isConfirmModalOpen = false;
  }

  getIngredientIdByName(name: string): string {
    const ing = this.availableIngredients.find((i) => i.name === name);
    return ing ? ing.id : '';
  }
}
