import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent 
{
  signupForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.signupForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      age: [''],
    });
  }

  onSignup() {
    this.http.post('http://localhost:3000/api/signup', this.signupForm.value).subscribe(
      () => {
        alert('Signup successful!');
        // this.router.navigate(['/login']);
      },
      (error) => {
        alert('Signup failed: ' + error.error.message);
      }
    );
  }
}
