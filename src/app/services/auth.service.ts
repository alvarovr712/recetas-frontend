import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from "../models/dtos/login-request.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:8080';  // Pon aquí la URL real de tu backend

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginRequest, {
      responseType: 'text',       // porque el cuerpo es "Login exitoso"
      withCredentials: true       // MUY importante para que se reciba la cookie HTTPOnly
    });
  }

 
}








