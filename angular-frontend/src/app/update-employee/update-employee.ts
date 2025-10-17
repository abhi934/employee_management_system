import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-employee.html',
  styleUrl: './update-employee.css'
})



export class UpdateEmployee {

  id: number;
  employee: Employee=new Employee();

  constructor(private employeeservice: EmployeeService, 
    private route: ActivatedRoute,
  private router: Router){}


  ngOnInit(): void{
    this.id=this.route.snapshot.params['id'];

    this.employeeservice.getEmployeeById(this.id).subscribe(data => {
      this.employee=data;
    }, error=> console.log(error));
    
  }


    onSubmit() {
      this.employeeservice.updateEmployee(this.id, this.employee).subscribe(data =>{
        this.goToEmployeeList();
      }, error=> console.log(error));

      
  }

  goToEmployeeList(){
    this.router.navigate(['/employees']);
  }
  
}
