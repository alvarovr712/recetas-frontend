import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterDto } from '../models/dtos/register-dto';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<any> {
    const formData = new FormData();

    formData.append('name', dto.name);
    formData.append('surnames', dto.surnames);
    formData.append('email', dto.email);
    formData.append('username', dto.username);
    formData.append('password', dto.password);

    if (dto.image) {
      formData.append('image', dto.image);
    }

    return this.http.post(`${this.baseUrl}/user/register`, formData);
  }
}
