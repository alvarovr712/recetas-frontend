import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DashboardDTO } from '../models/dtos/dashboard-dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(month?: number, year?: number) {
    let url = this.baseUrl;
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return this.http.get<DashboardDTO>(url);
  }

  
}
