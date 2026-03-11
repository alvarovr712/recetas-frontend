import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { RecipeDetailDto } from '../../../models/dtos/recipe-detail';

@Component({
  selector: 'app-detail-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-recipe.html',
  styleUrl: './detail-recipe.css',
})
export class DetailRecipe implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  recipe: RecipeDetailDto | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/recipes']);
      return;
    }

    this.recipeService.getRecipeDetail(id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.recipe = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.error = 'No se pudo cargar la receta.';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      Desayuno: 'Desayuno',
      Principal: 'Plato Principal',
      Snacks: 'Snacks',
      Postres: 'Postres',
    };
    return map[type] ?? type;
  }

  toggleFavorite() {
    if (!this.recipe) return;
    this.recipeService.toggleFavorite(this.recipe.id).subscribe({
      next: (res) => {
        if (this.recipe) {
          this.recipe.isFavorite = res.favorite;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error toggling favorite', err),
    });
  }
}
