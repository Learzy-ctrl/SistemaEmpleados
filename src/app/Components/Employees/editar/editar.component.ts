import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeesServiceService } from '../../../Services/Employees/employees-service.service';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Department } from '../../../Models/Department';
import { JobTitle } from '../../../Models/JobTitle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  employeeForm: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  employeeId!: number;
  departments: Department[] = [];
  jobTitles: JobTitle[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesServiceService,
    private departmentService: DepartmentsServiceService,
    private jobTitleService: JobTitlesServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      employeeId: [{ value: '', disabled: true }],
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
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartments();
    this.loadJobTitles();
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.buscar(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          hireDate: this.formatDate(employee.hireDate),
          salary: employee.salary,
          departmentId: employee.departmentId,
          jobTitleId: employee.jobTitleId
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el empleado',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          this.router.navigate(['/employees/listar']);
        });
      }
    });
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

  private formatDate(date: any): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  get f() {
    return this.employeeForm.controls;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isEditing = true;
    const employee = {
      employeeId: this.employeeId,
      ...this.employeeForm.value,
      salary: Number(this.employeeForm.value.salary),
      departmentId: Number(this.employeeForm.value.departmentId),
      jobTitleId: Number(this.employeeForm.value.jobTitleId)
    };

    this.employeeService.editar(employee).subscribe({
      next: (response) => {
        this.isEditing = false;
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
        this.isEditing = false;
        const errorMsg = err.error?.mensaje || 'Error al actualizar el empleado';
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
      if (control.enabled) control.markAsTouched();
    });
    Swal.fire({
      icon: 'warning',
      title: 'Validación',
      text: 'Por favor complete correctamente todos los campos',
      confirmButtonColor: '#0d6efd'
    });
  }
}