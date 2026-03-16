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
import { RecipeIngredientDto, RecipeStepDto } from '../../../models/dtos/recipe-detail';

interface RecipeStep {
  id: number;
  instruction: string;
  image?: string;
}

interface RecipeIngredient {
  ingredientId?: string;
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
  isManualIngredientMode = false; // Toggle for "Create New" vs "Select"
  selectedIngredientId = ''; // Selected ingredient ID from <select>
  recipeImageUrl: string = '';
  myRecipes : RecipeCard[] = [];
  uploadedImagesThisSession: string[] = [];

  // Modal Logic
  isModalOpen = false;
  isConfirmModalOpen = false;
  isDeleteConfirmModalOpen = false;
  isCreatingIngredient = false;
  isEditing = false;
  editingRecipeId: string | null = null;
  recipeToDelete: RecipeCard | null = null;

  newIngredientName = '';
  newIngredientQty = '';
  newIngredientUnit = 'unidad';

  ngOnInit() {
    this.loadIngredients().subscribe({
      next: (data) => {
        this.availableIngredients = data;
        this.updateIngredientNewState();
      },
      error: (err) => console.error('Error inicial de carga', err),
    });
    this.loadMyRecipes();
  }

  loadMyRecipes(category?: string) {
    this.recipeService.getMisRecetas(category).subscribe({
      next: (data) => {
        this.myRecipes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando mis recetas', err);
        this.toastr.error('No se pudieron cargar tus recetas');
      },
    });
  }

  onCategoryChanged(category: string) {
    this.loadMyRecipes(category);
  }

  loadIngredients(): Observable<Ingredient[]> {
    return this.ingredientService.buscarTodos();
  }

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
  
  get canAddIngredient(): boolean {
    if (this.isManualIngredientMode) return false; // In creation mode, must create first
    return !!this.selectedIngredientId && !!this.newIngredientQty && !!this.newIngredientUnit;
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

  categories = ['Desayuno', 'Principal', 'Snack', 'Postre'];

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  onEditRecipe(recipe: RecipeCard) {
    this.recipeService.getRecipeDetail(recipe.id).subscribe({
      next: (detail) => {
        setTimeout(() => {
          this.isEditing = true;
          this.editingRecipeId = recipe.id;
          this.recipeImageUrl = detail.image;

          this.newRecipe = {
            title: detail.title,
            category: detail.type,
            prepTime: detail.prepTime,
            servings: detail.servings,
            description: detail.description,
            ingredients: detail.ingredients.map((ing: RecipeIngredientDto) => ({
              ingredientId: ing.ingredientId,
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
            })),
            steps: detail.steps.map((step: RecipeStepDto, index: number) => ({
              id: index + 1,
              instruction: step.instruction,
              image: step.image,
            })),
          };
          this.openModal();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo cargar el detalle de la receta');
      },
    });
  }

  closeModal() {
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      this.isModalOpen = false;
      this.isEditing = false;
      this.editingRecipeId = null;
      this.resetForm();
      this.cdr.detectChanges();
    }, 0);
  }

  resetForm() {
    // Clean up temporary images that weren't saved
    this.uploadedImagesThisSession.forEach(url => {
      this.imageService.deleteImage(url).subscribe();
    });
    this.uploadedImagesThisSession = [];

    this.newRecipe = {
      title: '',
      category: '',
      prepTime: 30,
      servings: 4,
      ingredients: [] as RecipeIngredient[],
      description: '',
      steps: [{ id: 1, instruction: '' }],
    };
    this.recipeImageUrl = '';
    this.newIngredientName = '';
    this.newIngredientQty = '';
    this.selectedIngredientId = '';
    this.isManualIngredientMode = false;
  }

  onRecipeImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageService.uploadImage(file).subscribe({
        next: (res) => {
          // If we had a previous temporary image, delete it
          if (this.recipeImageUrl && this.uploadedImagesThisSession.includes(this.recipeImageUrl)) {
            this.imageService.deleteImage(this.recipeImageUrl).subscribe();
            this.uploadedImagesThisSession = this.uploadedImagesThisSession.filter(u => u !== this.recipeImageUrl);
          }
          this.recipeImageUrl = res.url;
          this.uploadedImagesThisSession.push(res.url);
          this.cdr.detectChanges();
          this.toastr.success('Imagen subida correctamente');
        },
        error: () => this.toastr.error('Error al subir la imagen'),
      });
    }
  }

  addIngredient(event?: Event) {
    if (event) event.preventDefault();
    if (!this.canAddIngredient) return;

    const selectedIng = this.availableIngredients.find(i => i.id === this.selectedIngredientId);
    if (!selectedIng) return;

    this.newRecipe.ingredients.push({
      name: selectedIng.name,
      quantity: this.newIngredientQty,
      unit: this.newIngredientUnit,
      ingredientId: selectedIng.id,
    });

    this.selectedIngredientId = '';
    this.newIngredientQty = '';
  }

  removeIngredient(index: number) {
    this.newRecipe.ingredients.splice(index, 1);
  }

  addStep() {
    const nextId = this.newRecipe.steps.length + 1;
    this.newRecipe.steps.push({ id: nextId, instruction: '' });
  }

  removeStep(index: number) {
    const step = this.newRecipe.steps[index];
    if (step.image && this.uploadedImagesThisSession.includes(step.image)) {
      this.imageService.deleteImage(step.image).subscribe();
      this.uploadedImagesThisSession = this.uploadedImagesThisSession.filter(u => u !== step.image);
    }
    this.newRecipe.steps.splice(index, 1);
    // Recalculate IDs
    this.newRecipe.steps.forEach((step, i) => (step.id = i + 1));
  }

  onStepImageSelected(event: any, step: RecipeStep) {
    const file = event.target.files[0];
    if (file) {
      this.imageService.uploadImage(file).subscribe({
        next: (res) => {
          // If the step had a previous temporary image, delete it
          if (step.image && this.uploadedImagesThisSession.includes(step.image)) {
            this.imageService.deleteImage(step.image).subscribe();
            this.uploadedImagesThisSession = this.uploadedImagesThisSession.filter(u => u !== step.image);
          }
          step.image = res.url;
          this.uploadedImagesThisSession.push(res.url);
          this.cdr.detectChanges();
          this.toastr.success('Imagen del paso subida');
        },
        error: () => this.toastr.error('Error al subir imagen del paso'),
      });
    }
  }

  saveRecipe() {
    if (!this.recipeImageUrl) {
      this.toastr.error('Debes subir una imagen principal');
      return;
    }
    this.isConfirmModalOpen = true;
  }

  confirmSave() {
    setTimeout(() => {
      this.isConfirmModalOpen = false;
      this.cdr.detectChanges();
    }, 0);

    const dto: any = {
      title: this.newRecipe.title,
      description: this.newRecipe.description,
      type: this.newRecipe.category,
      prepTime: Number(this.newRecipe.prepTime),
      servings: Number(this.newRecipe.servings),
      image: this.recipeImageUrl,
      ingredients: this.newRecipe.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId || this.getIngredientIdByName(ing.name),
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      steps: this.newRecipe.steps.map((step, index) => ({
        stepOrder: index + 1,
        instruction: step.instruction,
        imageStep: step.image || '',
      })),
    };

    if (this.isEditing && this.editingRecipeId) {
      dto.id = this.editingRecipeId;
      this.recipeService.editarReceta(dto).subscribe({
        next: () => {
          this.toastr.success('Receta actualizada correctamente');
          this.uploadedImagesThisSession = []; // They are saved now, don't clean up
          this.closeModal();
          this.loadMyRecipes();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error al editar la receta');
        },
      });
    } else {
      this.recipeService.crearReceta(dto).subscribe({
        next: () => {
          this.toastr.success('Receta creada correctamente');
          this.uploadedImagesThisSession = []; // They are saved now, don't clean up
          this.closeModal();
          this.loadMyRecipes();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error al crear la receta');
        },
      });
    }
  }

  onDeleteRecipe(recipe: RecipeCard) {
    this.recipeToDelete = recipe;
    this.isDeleteConfirmModalOpen = true;
  }

  confirmDelete() {
    if (this.recipeToDelete) {
      this.recipeService.eliminarReceta(this.recipeToDelete.id).subscribe({
        next: () => {
          this.toastr.success('Receta eliminada correctamente');
          setTimeout(() => {
            this.isDeleteConfirmModalOpen = false;
            this.recipeToDelete = null;
            this.loadMyRecipes();
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error al eliminar la receta');
        }
      });
    }
  }

  cancelDelete() {
    setTimeout(() => {
      this.isDeleteConfirmModalOpen = false;
      this.recipeToDelete = null;
      this.cdr.detectChanges();
    }, 0);
  }

  cancelConfirm() {
    setTimeout(() => {
      this.isConfirmModalOpen = false;
      this.cdr.detectChanges();
    }, 0);
  }

  createNewIngredient() {
    if (this.newIngredientName.trim() && !this.isCreatingIngredient) {
      this.isCreatingIngredient = true;
      this.ingredientService.crearIngrediente(this.newIngredientName.trim()).subscribe({
        next: (newIng) => {
          this.loadIngredients().subscribe({
            next: (data) => {
              this.availableIngredients = data;
              // Buscamos el recién creado para seleccionarlo
              const created = this.availableIngredients.find(i => 
                (i.name || (i as any).nombre).toLowerCase() === this.newIngredientName.trim().toLowerCase()
              );
              
              if (created) {
                this.selectedIngredientId = created.id;
              }
              
              this.isCreatingIngredient = false;
              this.isManualIngredientMode = false;
              this.newIngredientName = '';
              this.updateIngredientNewState();
              this.toastr.success('Ingrediente creado correctamente y seleccionado', 'Éxito');
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error al recargar', err);
              this.isCreatingIngredient = false;
              this.cdr.detectChanges();
            },
          });
        },
        error: (err) => {
          console.error('Error al crear ingrediente', err);
          const errorMsg = err.error?.message || err.error || 'No se pudo crear el ingrediente';
          this.toastr.error(errorMsg, 'Error');
          this.isCreatingIngredient = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  getIngredientIdByName(name: string): string {
    const ing = this.availableIngredients.find((i) => (i.name || (i as any).nombre) === name);
    return ing ? ing.id : '';
  }
}
