import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails {

  id: number;
  employee: Employee

constructor(private route: ActivatedRoute, private employeeservice: EmployeeService){}

  ngOnInit(): void{
    this.id=this.route.snapshot.params['id'];

    this.employee=new Employee();

    this.employeeservice.getEmployeeById(this.id).subscribe((data)=>{
      this.employee=data;
    });

    
  }

}
