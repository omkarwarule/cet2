import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Fixed typo
})
export class HomeComponent {
  temp: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.sharedService.currentTemp.subscribe((value) => 
      {
      this.temp = value;
      this.cdr.markForCheck(); // Notify Angular to check for changes
    });
  }
  

  onLogout() {
    if (isPlatformBrowser(this.platformId)) {
      this.temp = false;
      this.sharedService.updateTemp(false);
      alert('Logged out successfully!');
      this.router.navigate(['/login']);
    }
  }

  onLogin() {
    this.sharedService.updateTemp(true);
    this.router.navigate(['/app/home']);
  }
}
