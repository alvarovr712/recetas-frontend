import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

   buscarTodos(): Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>(`${this.baseUrl}/ingredients`, {withCredentials: true});
   }

   crearIngrediente(nombre:string): Observable<Ingredient>{
    return this.http.post<Ingredient>(
      `${this.baseUrl}/ingredients/crear`, {nombre}, {withCredentials:true}
    )
   }






}








