import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';
import { CreateRecipeRequest } from '../models/dtos/create-recipe-request';



@Injectable({
  providedIn: 'root'
})
export class IngredientService {
    private readonly baseUrl = 'http://localhost:5036/recipe';

    constructor(private http: HttpClient) {}

    crearReceta(request: CreateRecipeRequest): Observable<any>{
        return this.http.post(`${this.baseUrl}/crear`,request,{withCredentials:true});
    }

   
}