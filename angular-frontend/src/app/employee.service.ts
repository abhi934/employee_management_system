// employee.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseURL = 'http://localhost:8080/api/v1/employees';

  constructor(private httpClient: HttpClient) {}

  private get email(): string {
    const e = localStorage.getItem('userEmail');
    if (!e) throw new Error('Not logged in: userEmail missing');
    return e;
   
  }

  getEmployeesList(email?: string): Observable<Employee[]> {
    const q = encodeURIComponent(email ?? this.email);
    return this.httpClient.get<Employee[]>(`${this.baseURL}?email=${q}`);
  }

createEmployee(employee: Employee): Observable<Employee> {
  const email = localStorage.getItem('userEmail');
  if (!email) throw new Error('No logged-in user');
  const q = encodeURIComponent(email);
  return this.httpClient.post<Employee>(`${this.baseURL}?email=${q}`, employee);
}


  getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.baseURL}/${id}`);
  }


  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const q = encodeURIComponent(this.email);
    return this.httpClient.put<Employee>(`${this.baseURL}/${id}?email=${q}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    const q = encodeURIComponent(this.email);
    return this.httpClient.delete(`${this.baseURL}/${id}?email=${q}`);
  }

  setActive(id: number, active: boolean): Observable<Employee> {
    const q = encodeURIComponent(this.email);
    return this.httpClient.patch<Employee>(
      `${this.baseURL}/${id}/status?email=${q}&active=${active}`,
      {}
    );
  }
}
