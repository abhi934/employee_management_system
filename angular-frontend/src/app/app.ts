import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-frontend');

  constructor(private router: Router) {}

  get email() { return localStorage.getItem('userEmail'); }
  get role()  { return localStorage.getItem('userRole'); }
  get isHR()  { return this.role === 'HR'; }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
