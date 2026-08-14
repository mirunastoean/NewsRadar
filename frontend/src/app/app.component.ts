import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/newsradar',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  clientId: 'angular-frontend',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  clearHashAfterLogin: true,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NewsRadar';

  constructor(
    private oauthService: OAuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.configureAuth();
    }
  }

  private configureAuth() {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    if (isPlatformBrowser(this.platformId)) {
      this.oauthService.initCodeFlow();
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.oauthService.logOut();
    }
  }

  get isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
    }
    return false;
  }

  get userName() {
    if (isPlatformBrowser(this.platformId)) {
      const claims = this.oauthService.getIdentityClaims() as any;
      if (!claims) return null;
      return claims.preferred_username || claims.name;
    }
    return null;
  }
}