import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router,Route } from '@angular/router';
import { SharedService } from '../shared.service';
import { isPlatformBrowser } from '@angular/common';
import { SignupComponent } from '../signup/signup.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  temp: boolean = false;
  email: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
    @Inject(PLATFORM_ID) private platformId: object // Inject platformId
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
  
  onLogin() {
    this.http.post('http://localhost:3000/api/login', this.loginForm.value).subscribe(
      (response: any) => {
        this.email = this.loginForm.value.email;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
        }

        this.temp = true;
        this.sharedService.updateTemp(this.temp);
        this.sharedService.updateProfile(this.email);
        
        alert('Login successful!');
        this.router.navigate(['/app']);
      },
      (error) => {
        alert('Login failed: ' + (error.error?.message || 'Unknown error occurred'));
      }
    );
  }
}
