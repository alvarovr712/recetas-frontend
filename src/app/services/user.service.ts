import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterDto } from '../models/dtos/register-dto';

import { environment } from '../../environments/environment';
import { UserProfileDto } from '../models/dtos/user-profile-dto';
import { UpdateUserDto } from '../models/dtos/update-user-dto';

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

  getProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.baseUrl}/user/profile`, {
      withCredentials: true, // importante si usas cookies HttpOnly
    });
  }

  updateUser(dto: UpdateUserDto): Observable<any> {
    const formData = new FormData();

    if (dto.name) formData.append('name', dto.name);
    if (dto.surnames) formData.append('surnames', dto.surnames);
    if (dto.email) formData.append('email', dto.email);
    if (dto.username) formData.append('username', dto.username);
    if (dto.password) formData.append('password', dto.password);
    if (dto.image) formData.append('image', dto.image);

    return this.http.put(`${this.baseUrl}/user/update`, formData, {
      withCredentials: true,
    });
  }
}
