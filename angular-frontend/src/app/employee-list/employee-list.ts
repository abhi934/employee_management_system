import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {
  employees: Employee[] = [];

  page = 1;         
  pageSize = 5;     

  get role(): string | null {
    return localStorage.getItem('userRole');
  }

  get email(): string {
    return (localStorage.getItem('userEmail') || '').toLowerCase();
  }

  get isHR(): boolean {
    return this.role === 'HR';
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if user is not logged in
    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch employees based on role
    this.employeeService.getEmployeesList().subscribe({
      next: (data) => {
        this.employees = this.isHR
          ? data // HR sees all
          : data.filter(
              (e) => (e.emailId || '').toLowerCase() === this.email // employee sees only themselves
            );
        this.ensurePageInRange();
      },
      error: (err) => console.error('Error fetching employees', err)
    });
  }


   get filteredEmployees(): Employee[] {
      return this.employees;
  }

  get totalPages(): number {
    const total = this.filteredEmployees.length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  get pagedEmployees(): Employee[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  goToPage(p: number): void {
    this.page = Math.min(Math.max(1, p), this.totalPages);
  }

  nextPage(): void {
    this.goToPage(this.page + 1);
  }

  prevPage(): void {
    this.goToPage(this.page - 1);
  }

  setPageSize(size: number | string): void {
    const n = Number(size) || this.pageSize;
    this.pageSize = Math.max(1, n);
    this.ensurePageInRange();
  }

  private ensurePageInRange(): void {
    if (this.page > this.totalPages) {
      this.page = this.totalPages || 1;
    }
  }

  isOwner(employee: Employee): boolean {
    return (employee.emailId || '').toLowerCase() === this.email;
  }

  updateEmployee(id: number): void {
    this.router.navigate(['update-employee', id]);
  }

  deleteEmployee(id: number): void {
    const emp = this.employees.find(e => e.id === id);
    if (!this.isHR) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => console.error('Error deleting employee', err)
    });
  }

  employeeDetails(id: number): void {
    this.router.navigate(['employee-details', id]);
  }

  toggleActive(employee: Employee): void {
    if (!this.isHR) return;
    const nextStatus = !employee.isActive;
    this.employeeService.setActive(employee.id, nextStatus).subscribe({
      next: (updated) => {
        employee.isActive = updated.isActive;
        employee.statusChangeAt = updated.statusChangeAt;
      },
      error: (err) => console.error('Error toggling status', err)
    });
  }
}
