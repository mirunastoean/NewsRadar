import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {

      if (this.oauthService.hasValidAccessToken()) {
        return true; 
      }
      const queryParams = window.location.search;
      if (queryParams.includes('code=') || queryParams.includes('state=')) {
        return true;
      }

      this.oauthService.initCodeFlow();
      return false;
    }
    
    return true;
  }
}