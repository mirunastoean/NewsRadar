import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      if (this.oauthService.hasValidAccessToken()) {
        return true; 
      }
      this.oauthService.initCodeFlow();
      return false;
    }

    return true; 
  }
}