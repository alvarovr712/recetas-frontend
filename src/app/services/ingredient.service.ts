import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';



@Injectable({
  providedIn: 'root'
})
export class IngredientService {
    private readonly baseUrl = 'http://localhost:5036';

    constructor(private http: HttpClient) {}

   buscarTodos(): Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>(`${this.baseUrl}/ingredients`);
   }

   crearIngrediente(nombre:string): Observable<Ingredient>{
    return this.http.post<Ingredient>(
      `${this.baseUrl}/ingredients/crear`, {nombre}, {withCredentials:true}
    )
   }






}








