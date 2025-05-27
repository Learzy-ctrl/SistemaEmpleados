import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Employee } from '../../../Models/Employee';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
  employee: Employee;
  departmentName: string = 'Cargando...';
  jobTitleName: string = 'Cargando...';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee },
    private departmentService: DepartmentsServiceService,
    private jobTitleService: JobTitlesServiceService
  ) {
    this.employee = data.employee;
    this.loadDepartmentName();
    this.loadJobTitleName();
  }

  loadDepartmentName(): void {
    this.departmentService.buscar(this.employee.departmentId).subscribe({
      next: (department) => {
        this.departmentName = department.departmentName;
      },
      error: () => {
        this.departmentName = 'Desconocido';
      }
    });
  }

  loadJobTitleName(): void {
    this.jobTitleService.buscar(this.employee.jobTitleId).subscribe({
      next: (jobTitle) => {
        this.jobTitleName = jobTitle.jobTitle;
      },
      error: () => {
        this.jobTitleName = 'Desconocido';
      }
    });
  }
}