import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeesServiceService } from '../../../Services/Employees/employees-service.service';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Department } from '../../../Models/Department';
import { JobTitle } from '../../../Models/JobTitle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  employeeForm: FormGroup;
  isLoading: boolean = false;
  departments: Department[] = [];
  jobTitles: JobTitle[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesServiceService,
    private departmentService: DepartmentsServiceService,
    private jobTitleService: JobTitlesServiceService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      employeeId: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.minLength(9),
        Validators.maxLength(15)
      ]],
      hireDate: ['', [
        Validators.required
      ]],
      salary: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
        Validators.min(0)
      ]],
      departmentId: ['', [
        Validators.required
      ]],
      jobTitleId: ['', [
        Validators.required
      ]]
    });

    this.loadDepartments();
    this.loadJobTitles();
  }

  loadDepartments(): void {
    this.departmentService.mostrar().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      }
    });
  }

  loadJobTitles(): void {
    this.jobTitleService.mostrar().subscribe({
      next: (data) => {
        this.jobTitles = data;
      },
      error: (err) => {
        console.error('Error loading job titles:', err);
      }
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const employee = {
      ...this.employeeForm.value,
      employeeId: Number(this.employeeForm.value.employeeId),
      salary: Number(this.employeeForm.value.salary),
      departmentId: Number(this.employeeForm.value.departmentId),
      jobTitleId: Number(this.employeeForm.value.jobTitleId)
    };

    this.employeeService.agregar(employee).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.mensaje,
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            this.router.navigate(['/employees/listar']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.mensaje,
            confirmButtonColor: '#0d6efd'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.error?.mensaje || 'Error al crear el empleado';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#0d6efd'
        });
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.employeeForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Swal.fire({
      icon: 'warning',
      title: 'Validación',
      text: 'Por favor complete correctamente todos los campos',
      confirmButtonColor: '#0d6efd'
    });
  }
}