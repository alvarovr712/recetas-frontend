import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  deleteImage(url: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete`, {
      params: { url },
      withCredentials: true
    });
  }
}