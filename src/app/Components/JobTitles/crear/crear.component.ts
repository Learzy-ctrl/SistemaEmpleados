import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
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
  jobTitleForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jobTitleService: JobTitlesServiceService,
    private router: Router
  ) {
    this.jobTitleForm = this.fb.group({
      jobTitleId: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ]],
      jobTitle: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]]
    });
  }

  get f() {
    return this.jobTitleForm.controls;
  }

  onSubmit(): void {
    if (this.jobTitleForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const jobTitle = {
      jobTitleId: Number(this.jobTitleForm.value.jobTitleId),
      jobTitle: this.jobTitleForm.value.jobTitle
    };

    this.jobTitleService.agregar(jobTitle).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.mensaje,
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            this.router.navigate(['/jobTitles/listar']);
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
        const errorMsg = err.error?.mensaje || 'Error al crear el puesto de trabajo';
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
    Object.values(this.jobTitleForm.controls).forEach(control => {
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