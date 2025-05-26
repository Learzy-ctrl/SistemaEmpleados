import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  departmentForm: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  departmentId!: number;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentsServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.departmentForm = this.fb.group({
      departmentId: [{ value: '', disabled: true }],
      departmentName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartment();
  }

  loadDepartment(): void {
    this.isLoading = true;
    this.departmentService.buscar(this.departmentId).subscribe({
      next: (department) => {
        this.departmentForm.patchValue({
          departmentId: department.departmentId,
          departmentName: department.departmentName
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el departamento',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          this.router.navigate(['/departments/listar']);
        });
      }
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

    this.isEditing = true;
    const department = {
      departmentId: this.departmentId,
      departmentName: this.departmentForm.value.departmentName
    };

    this.departmentService.editar(department).subscribe({
      next: (response) => {
        this.isEditing = false;
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
        this.isEditing = false;
        const errorMsg = err.error?.mensaje || 'Error al actualizar el departamento';
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