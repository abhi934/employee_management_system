import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css'
})
export class CreateEmployee {
  employee: Employee = new Employee();
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    // Load logged-in user info from localStorage
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');

    // If not HR or not logged in, redirect
    if (!this.userEmail || this.userRole !== 'HR') {
      alert('Access denied. Only HR can add employees.');
      this.router.navigate(['/employees']);
    }
  }

  saveEmployee(): void {
    this.employeeService.createEmployee(this.employee).subscribe({
      next: (data) => {
        console.log('Employee created successfully:', data);
        alert('Employee added successfully!');
        this.goToEmployeeList();
      },
      error: (err) => {
        console.error('Error creating employee:', err);
        alert(err.error || 'Failed to create employee. Only HR can add employees.');
      }
    });
  }

  goToEmployeeList(): void {
    this.router.navigate(['/employees']);
  }

  onSubmit(): void {
    console.log('Creating employee:', this.employee);
    this.saveEmployee();
  }
}
