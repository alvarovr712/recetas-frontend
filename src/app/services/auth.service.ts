import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from "../models/dtos/login-request.model";
import { UserInfoDTO } from '../models/dtos/user-info-dto';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<UserInfoDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginRequest, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getUserInfo(): Observable<UserInfoDTO> {
    return this.http.get<UserInfoDTO>(
      `${this.baseUrl}/auth/me`,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
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








