import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SystemStats {
  totalArticles: number;
  articlesToday: number;
  activeSources: number;
  lastSync: Date;
  kafkaStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  
  getStats(): Observable<SystemStats> {
    const mockData: SystemStats = {
      totalArticles: 14532,
      articlesToday: 128,
      activeSources: 5,
      lastSync: new Date(),
      kafkaStatus: 'Online'
    };
    
    return of(mockData).pipe(delay(500));
  }
}