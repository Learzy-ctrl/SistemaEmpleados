import { Component, OnInit } from '@angular/core';
import { DepartmentsServiceService } from '../../../Services/Departments/departments-service.service';
import { Department } from '../../../Models/Department';
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
  departments: Department[] = [];
  isLoading: boolean = true;

  constructor(private departmentService: DepartmentsServiceService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.mostrar().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert('error', 'Error', 'No se pudieron cargar los departamentos');
        console.error('Error loading departments:', err);
      }
    });
  }

  deleteDepartment(id: number): void {
    Swal.fire({
      title: '¿Eliminar departamento?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.eliminar(id).subscribe({
          next: (response) => {
            this.handleResponse(response);
            this.loadDepartments(); // Recargar la lista
          },
          error: (err) => {
            const errorMsg = err.error?.mensaje || 'Error al eliminar el departamento';
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