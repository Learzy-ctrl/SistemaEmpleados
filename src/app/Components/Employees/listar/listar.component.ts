import { Component, OnInit } from '@angular/core';
import { EmployeesServiceService } from '../../../Services/Employees/employees-service.service';
import { Employee } from '../../../Models/Employee';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  
  employees: Employee[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';

  constructor(
    private employeeService: EmployeesServiceService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.mostrar().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert('error', 'Error', 'No se pudieron cargar los empleados');
        console.error('Error loading employees:', err);
      }
    });
  }

  deleteEmployee(id: number): void {
    Swal.fire({
      title: '¿Eliminar empleado?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.eliminar(id).subscribe({
          next: (response) => {
            this.handleResponse(response);
            this.loadEmployees(); 
          },
          error: (err) => {
            const errorMsg = err.error?.mensaje || 'Error al eliminar el empleado';
            this.showAlert('error', 'Error', errorMsg);
          }
        });
      }
    });
  }

  filteredEmployees(): Employee[] {
    if (!this.searchTerm) return this.employees;
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.phoneNumber.includes(this.searchTerm)
    );
  }

  paginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees().slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.filteredEmployees().length / this.itemsPerPage);
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