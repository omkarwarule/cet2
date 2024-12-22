import { Component,ChangeDetectorRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent 
{
  user: any;
  temp : any;
  constructor(private http: HttpClient,private shared :SharedService,private cdr: ChangeDetectorRef) 
  {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe(
        (data) => (this.user = data),
        (error) => alert('Failed to load profile: ${error.status} ${error.statusText}' + error.error.message)
      );
    }
  }
  ngOnInit() 
  {
    this.shared.currentemail.subscribe((value) => 
      {
      this.temp = value;
      this.cdr.markForCheck(); 
    });
  }
}
