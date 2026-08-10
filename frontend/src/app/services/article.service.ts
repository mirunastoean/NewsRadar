import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Article {
  id: number;
  title: string;
  url: string;
  content?: string;
  source: string;
  published_at?: string;
  summary?: string;
  sentiment?: string;
  category?: string;
  entities?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  getArticles(searchTerm?: string): Observable<Article[]> {
    let params = new HttpParams();
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<Article[]>(this.apiUrl, { params });
  }
}