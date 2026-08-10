import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService, Article } from '../services/article.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule, 
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.fetchArticles();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.fetchArticles(term);
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  fetchArticles(search: string = '') {
    this.articleService.getArticles(search).subscribe({
      next: (data) => this.articles = data,
      error: (err) => console.error('Eroare la aducerea știrilor:', err)
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.fetchArticles();
  }

  getSentimentClass(sentiment: string | undefined): string {
    if (!sentiment) return 'sentiment-neutru';
    const s = sentiment.toLowerCase();
    if (s.includes('pozitiv')) return 'sentiment-pozitiv';
    if (s.includes('negativ')) return 'sentiment-negativ';
    return 'sentiment-neutru';
  }

  getSentimentIcon(sentiment: string | undefined): string {
    if (!sentiment) return 'horizontal_rule';
    const s = sentiment.toLowerCase();
    if (s.includes('pozitiv')) return 'trending_up';
    if (s.includes('negativ')) return 'trending_down';
    return 'drag_handle';
  }
}