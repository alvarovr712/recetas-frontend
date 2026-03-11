import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { RecipeCard } from '../../../models/dtos/recipe-card';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  favoriteRecipes:RecipeCard[] = [];

  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void{
    this.loadFavorites();

  }

  loadFavorites(){
    this.recipeService.getFavoritas().subscribe({
      next: (res) =>{
        this.favoriteRecipes = res;
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error("Error cargando recetas favoritas",err);
      }
    });
  }

  onFavoriteToggled(recipe: RecipeCard) {
    if (!recipe.isFavorite) {
      // Si ya no es favorita, la sacamos de la lista al momento
      this.favoriteRecipes = this.favoriteRecipes.filter(r => r.id !== recipe.id);
      this.cdr.detectChanges();
    }
  }
}
