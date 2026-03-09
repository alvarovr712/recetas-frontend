import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:5036';

    constructor(private http: HttpClient) {}

   




}








