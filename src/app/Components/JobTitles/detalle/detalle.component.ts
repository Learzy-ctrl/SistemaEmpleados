import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { JobTitle } from '../../../Models/JobTitle';
import { EmployeesServiceService } from '../../../Services/Employees/employees-service.service';
import { Employee } from '../../../Models/Employee';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-jobtitle-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
  jobTitle: JobTitle;
  employees: Employee[] = [];
  isLoading: boolean = true;

  displayedColumns: string[] = ['id', 'name', 'email', 'department', 'salary'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { jobTitle: JobTitle },
    private employeeService: EmployeesServiceService
  ) {
    this.jobTitle = data.jobTitle;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.mostrar().subscribe({
      next: (employees) => {
        this.employees = employees.filter(emp => 
          emp.jobTitleId === this.jobTitle.jobTitleId
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}