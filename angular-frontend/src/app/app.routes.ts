import { Routes } from '@angular/router';
import { EmployeeList } from './employee-list/employee-list';
import { CreateEmployee } from './create-employee/create-employee';
import { UpdateEmployee } from './update-employee/update-employee';
import { EmployeeDetails } from './employee-details/employee-details';
import { Login } from './login/login';   

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  { path: 'employees', component: EmployeeList },
  { path: 'create-employee', component: CreateEmployee },
  { path: 'update-employee/:id', component: UpdateEmployee },
  { path: 'employee-details/:id', component: EmployeeDetails }
];
