import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  departmentForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentsServiceService,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({
      departmentId: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ]],
      departmentName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]]
    });
  }

  get f() {
    return this.departmentForm.controls;
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const department = {
      departmentId: Number(this.departmentForm.value.departmentId),
      departmentName: this.departmentForm.value.departmentName
    };

    this.departmentService.agregar(department).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.mensaje,
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            this.router.navigate(['/departments/listar']);
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
        const errorMsg = err.error?.mensaje || 'Error al crear el departamento';
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
    Object.values(this.departmentForm.controls).forEach(control => {
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