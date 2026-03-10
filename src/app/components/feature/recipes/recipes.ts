import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../shared/recipe-grid/recipe-grid';
import { RecipeCard } from '../../../models/dtos/recipe-card';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent implements OnInit {

  recipes:RecipeCard[] =[];

  ngOnInit(): void { }
}
