import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService, Article } from './services/article.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'NewsRadar';
  articles: Article[] = [];
  searchTerm: string = '';
  filteredArticles: Article[] = []; 
  
  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data; 
        console.log('Articole primite:', this.articles);
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