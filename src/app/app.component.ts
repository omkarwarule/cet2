import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { SharedService } from './shared.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent 
{
  temp: boolean = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
  ) {}

  ngOnInit() 
  {
    this.sharedService.currentTemp.subscribe((value) => 
      {
      this.temp = value; 
    });
  }

  // shouldShowNavbar(): boolean {
  //   if (isPlatformBrowser(this.platformId)) {
  //     return localStorage.getItem('isLoggedIn') === 'true';
  //   }
  //   return false;
  // }

  onLogout() 
  {
    this.temp = false; 
    this.sharedService.updateTemp(false);
    alert('Logged out successfully!');
    this.router.navigate(['/login']);
  }

  onLogin() {
    this.sharedService.updateTemp(true); 
    this.router.navigate(['/app/home']); 
  }
  
}
