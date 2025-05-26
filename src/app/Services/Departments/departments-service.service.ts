import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Department } from '../../Models/Department';
import { Respuesta } from '../../Models/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsServiceService {
  http = inject(HttpClient);
  url: string = environment.apiUrl + 'departments/';

  agregar(department: Department) {
    return this.http.post<Respuesta>(this.url + 'agregar', department);
  }
  editar(department: Department) {
    return this.http.post<Respuesta>(this.url + 'editar', department);
  }
  eliminar(id: number) {
    return this.http.get<Respuesta>(this.url + 'eliminar/' + id);
  }
  mostrar() {
    return this.http.get<Department[]>(this.url + 'mostrar');
  }
  buscar(id: number) {
    return this.http.get<Department>(this.url + 'buscar/' + id);
  }
}
