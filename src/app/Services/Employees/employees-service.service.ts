import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Employee } from '../../Models/Employee';
import { Respuesta } from '../../Models/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class EmployeesServiceService {
  http = inject(HttpClient);
  url: string = environment.apiUrl + 'employees/';

  agregar(employee: Employee){
    return this.http.post<Respuesta>(this.url + 'agregar', employee);
  }
  editar(employee: Employee){
    return this.http.post<Respuesta>(this.url + 'editar', employee);
  }
  eliminar(id: number){
    return this.http.get<Respuesta>(this.url + 'eliminar/' + id);
  }
  mostrar(){
    return this.http.get<Employee[]>(this.url + 'mostrar');
  }
  buscar(id: number) {
    return this.http.get<Employee>(this.url + 'buscar/' + id);
  }
}
