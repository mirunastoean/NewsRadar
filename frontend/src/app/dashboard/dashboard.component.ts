import { Component, OnInit } from '@angular/core';
import { ArticleService, Article } from '../services/article.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];
  searchTerm: string = '';
  filteredArticles: Article[] = []; 
  
  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data; 
      },
      error: (err) => console.error('Eroare la aducerea știrilor:', err)
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredArticles = this.articles.filter(article => 
      article.title.toLowerCase().includes(term) || 
      article.source.toLowerCase().includes(term)
    );
  }
}