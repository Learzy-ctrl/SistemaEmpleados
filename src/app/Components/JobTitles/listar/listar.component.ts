import { Component, OnInit } from '@angular/core';
import { JobTitlesServiceService } from '../../../Services/JobTitles/job-titles-service.service';
import { JobTitle } from '../../../Models/JobTitle';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  jobTitles: JobTitle[] = [];
  isLoading: boolean = true;

  constructor(private jobTitleService: JobTitlesServiceService) {}

  ngOnInit(): void {
    this.loadJobTitles();
  }

  loadJobTitles(): void {
    this.isLoading = true;
    this.jobTitleService.mostrar().subscribe({
      next: (data) => {
        this.jobTitles = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert('error', 'Error', 'No se pudieron cargar los puestos de trabajo');
        console.error('Error loading job titles:', err);
      }
    });
  }

  deleteJobTitle(id: number): void {
    Swal.fire({
      title: '¿Eliminar puesto de trabajo?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobTitleService.eliminar(id).subscribe({
          next: (response) => {
            this.handleResponse(response);
            this.loadJobTitles(); // Recargar la lista
          },
          error: (err) => {
            const errorMsg = err.error?.mensaje || 'Error al eliminar el puesto de trabajo';
            this.showAlert('error', 'Error', errorMsg);
          }
        });
      }
    });
  }

  private handleResponse(response: any): void {
    if (response.success) {
      this.showAlert('success', 'Éxito', response.mensaje);
    } else {
      this.showAlert('error', 'Error', response.mensaje);
    }
  }

  private showAlert(icon: 'success' | 'error' | 'warning' | 'info', 
                   title: string, 
                   text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#0d6efd',
      timer: icon === 'success' ? 2000 : 3000
    });
  }
}
