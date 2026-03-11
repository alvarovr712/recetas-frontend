import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';
import { CreateRecipeRequest } from '../models/dtos/create-recipe-request';
import { RecipeCard } from '../models/dtos/recipe-card';
import { RecipeDetailDto } from '../models/dtos/recipe-detail';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly baseUrl = 'http://localhost:5036/recipe';

  constructor(private http: HttpClient) {}

  crearReceta(request: CreateRecipeRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, request, { withCredentials: true });
  }

  getMisRecetas(): Observable<RecipeCard[]> {
    return this.http.get<RecipeCard[]>(`${this.baseUrl}/mis-recetas`, { withCredentials: true });
  }

  getRecipeDetail(id: string): Observable<RecipeDetailDto> {
    return this.http.get<RecipeDetailDto>(`${this.baseUrl}/detalle/${id}`, {
      withCredentials: true,
    });
  }

  getAllRecetas(category?: string): Observable<RecipeCard[]> {
    const params: any = {};

    if (category && category !== 'Todo') {
      params.category = category;
    }

    return this.http.get<RecipeCard[]>(`${this.baseUrl}/all`, {
      params,
      withCredentials: true,
    });
  }

  toggleFavorite(recipeId: string) {
    return this.http.post<{ favorite: boolean }>(
      `${this.baseUrl}/toggle-favorite/${recipeId}`,
      {},
      { withCredentials: true },
    );
  }
  getFavoritas() {
    return this.http.get<RecipeCard[]>(`${this.baseUrl}/favoritas`, {
      withCredentials: true,
    });
  }
}
