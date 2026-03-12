import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';
import { CreateRecipeRequest } from '../models/dtos/create-recipe-request';



import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
    private readonly baseUrl = `${environment.apiUrl}/images`;

    constructor(private http: HttpClient) {}

    uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.baseUrl}/upload`, formData, {
      withCredentials: true
    });
  }

   
}