import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { RecipeCard } from '../../../models/dtos/recipe-card';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent implements OnInit {

  recipes:RecipeCard[] =[];


  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void { 

    this.loadRecipes();
  }


  private loadRecipes():void{
    this.recipeService.getAllRecetas().subscribe({
      next:(data) => {
        this.recipes = data;
        this.cdr.detectChanges();
      },
      error:(err) => console.error('Error cargando recetas',err)
    })
  }
}
