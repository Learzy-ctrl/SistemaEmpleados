import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Department } from '../../../Models/Department';
import { EmployeesServiceService } from '../../../Services/Employees/employees-service.service';
import { Employee } from '../../../Models/Employee';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    DatePipe
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
  department: Department;
  employees: Employee[] = [];
  isLoading: boolean = true;

  displayedColumns: string[] = ['id', 'name', 'email', 'hireDate', 'salary'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { department: Department },
    private employeeService: EmployeesServiceService
  ) {
    this.department = data.department;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.mostrar().subscribe({
      next: (employees) => {
        this.employees = employees.filter(emp => 
          emp.departmentId === this.department.departmentId
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}