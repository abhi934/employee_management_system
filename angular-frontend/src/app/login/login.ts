import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.http.post<any>('http://localhost:8080/api/v1/users/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('userRole', res.role);

        this.router.navigate(['/employees']);
      },
      error: _ => {
        this.error = 'Invalid email or password';
        localStorage.clear(); // reset if login fails
      }
    });
  }
}
