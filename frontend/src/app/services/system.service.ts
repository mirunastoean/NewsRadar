import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SystemStats {
  totalArticles: number;
  articlesToday: number;
  activeSources: number;
  lastSync: string; 
  kafkaStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private apiUrl = 'http://localhost:8000/status'; 
  constructor(private http: HttpClient) {}

  getStats(): Observable<SystemStats> {
    return this.http.get<SystemStats>(this.apiUrl);
  }
}