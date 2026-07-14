import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleService, Article } from './services/article.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,MatCardModule, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'NewsRadar';
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}
  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        console.log('Articole primite:', this.articles);
      },
      error: (err) => console.error('Eroare la aducerea știrilor:', err)
    });
  }
}
