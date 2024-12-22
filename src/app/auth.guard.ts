import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  canActivate(): boolean {
    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('authToken'); // Safely access localStorage
      if (!isLoggedIn) {
        this.router.navigate(['/login']); // Redirect to login if not logged in
        return false;
      }
      return true;
    }

    // If not running in the browser, deny access
    this.router.navigate(['/login']);
    return false;
  }
}
