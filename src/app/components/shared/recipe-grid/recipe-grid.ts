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
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() recipes: RecipeCard[] = [];
  @Output() favoriteToggled = new EventEmitter<RecipeCard>();

  private recipeService = inject(RecipeService);

  categories = ['Todo', 'Desayuno', 'Plato Principal', 'Postres', 'Snacks'];
  selectedCategory = 'Todo';

  goToDetail(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredRecipes() {
    if (this.selectedCategory === 'Todo') {
      return this.recipes;
    }
    return this.recipes.filter(r => r.category === this.selectedCategory);
  }
  
  toggleFavorite(recipe: RecipeCard){
    this.recipeService.toggleFavorite(recipe.id).subscribe({
      next: (res) =>{
        recipe.isFavorite = res.favorite;
        this.recipes = [...this.recipes];
        this.cdr.detectChanges();
        this.favoriteToggled.emit(recipe);
      },
      error: (err) =>{
        console.error ("Error al cambiar favorito",err);
      }
    });
  }
}
