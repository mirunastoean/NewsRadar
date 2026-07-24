import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RssSource {
  id?: number;
  name: string;
  url: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private apiUrl = 'http://localhost:8000/sources'; 

  constructor(private http: HttpClient) {}

  getSources(): Observable<RssSource[]> {
    return this.http.get<RssSource[]>(this.apiUrl);
  }

  addSource(source: RssSource): Observable<RssSource> {
    return this.http.post<RssSource>(this.apiUrl, source);
  }

  deleteSource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}