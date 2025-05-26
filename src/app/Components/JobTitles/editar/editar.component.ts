import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
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
  jobTitleForm: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  jobTitleId!: number;

  constructor(
    private fb: FormBuilder,
    private jobTitleService: JobTitlesServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobTitleForm = this.fb.group({
      jobTitleId: [{ value: '', disabled: true }],
      jobTitle: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.jobTitleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJobTitle();
  }

  loadJobTitle(): void {
    this.isLoading = true;
    this.jobTitleService.buscar(this.jobTitleId).subscribe({
      next: (jobTitle) => {
        this.jobTitleForm.patchValue({
          jobTitleId: jobTitle.jobTitleId,
          jobTitle: jobTitle.jobTitle
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el puesto de trabajo',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          this.router.navigate(['/jobTitles/listar']);
        });
      }
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

    this.isEditing = true;
    const jobTitle = {
      jobTitleId: this.jobTitleId,
      jobTitle: this.jobTitleForm.value.jobTitle
    };

    this.jobTitleService.editar(jobTitle).subscribe({
      next: (response) => {
        this.isEditing = false;
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
        this.isEditing = false;
        const errorMsg = err.error?.mensaje || 'Error al actualizar el puesto de trabajo';
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