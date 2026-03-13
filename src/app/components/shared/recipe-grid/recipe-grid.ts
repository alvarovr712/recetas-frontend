import { Component, Input, inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeCard } from '../../../models/dtos/recipe-card';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-grid.html',
  styleUrl: './recipe-grid.css',
})
export class RecipeGrid {
  filtro: string = '';

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() recipes: RecipeCard[] = [];
  @Input() searchMode: 'all' | 'myrecipes' | 'favorites' = 'all';
  @Input() showEditActions: boolean = false;

  @Output() favoriteToggled = new EventEmitter<RecipeCard>();
  @Output() categoryChanged = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<RecipeCard>();
  @Output() deleteRequested = new EventEmitter<RecipeCard>();

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private recipeService = inject(RecipeService);

  categories = [
    { label: 'Todo', value: 'Todo' },
    { label: 'Desayuno', value: 'Desayuno' },
    { label: 'Plato Principal', value: 'Principal' },
    { label: 'Postres', value: 'Postre' },
    { label: 'Snacks', value: 'Snack' },
  ];

  selectedCategory = 'Todo';

  goToDetail(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.categoryChanged.emit(category);
  }

  toggleFavorite(recipe: RecipeCard) {
    this.recipeService.toggleFavorite(recipe.id).subscribe({
      next: (res) => {
        recipe.isFavorite = res.favorite;
        this.recipes = [...this.recipes];
        this.cdr.detectChanges();
        this.favoriteToggled.emit(recipe);
      },
      error: (err) => {
        console.error('Error al cambiar favorito', err);
      },
    });
  }

  onSearch(event: any) {
    this.filtro = event.target.value;

    // Si el filtro está vacío → avisar al padre para recargar recetas normales
    if (this.filtro.trim().length === 0) {
      this.searchCleared.emit();
      return;
    }

    // Seleccionar el modo de búsqueda según el padre
    if (this.searchMode === 'all') {
      this.recipeService.searchRecetas(this.filtro).subscribe({
        next: (data) => {
          this.recipes = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error buscando recetas', err),
      });
    } else if (this.searchMode === 'myrecipes') {
      this.recipeService.searchMisRecetas(this.filtro).subscribe({
        next: (data) => {
          this.recipes = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error buscando MIS recetas', err),
      });
    } else if (this.searchMode === 'favorites') {
      this.recipeService.searchFavoritas(this.filtro).subscribe({
        next: (data) => {
          this.recipes = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error buscando favoritas', err),
      });
    }
  }

  onEdit(recipe: RecipeCard) {
    this.editRequested.emit(recipe);
  }

  onDelete(recipe: RecipeCard) {
    this.deleteRequested.emit(recipe);
  }
}
