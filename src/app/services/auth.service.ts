import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from "../models/dtos/login-request.model";
import { UserInfoDTO } from '../models/dtos/user-info-dto';
import { TokenInfoDTO } from '../models/dtos/token-info-dto';
import { Token } from '@angular/compiler';


import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<TokenInfoDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginRequest, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getUserInfo(): Observable<TokenInfoDTO> {
    return this.http.get<TokenInfoDTO>(
      `${this.baseUrl}/auth/me`,
      { withCredentials: true }
    ).pipe(
      tap(info => {
        this.currentUserSubject.next(info);
      })
    );
  }

  refreshCurrentUser(): void {
    this.getUserInfo().subscribe({
      error: (err) => console.error('Error refreshing user info:', err)
    });
  }


  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }



}








