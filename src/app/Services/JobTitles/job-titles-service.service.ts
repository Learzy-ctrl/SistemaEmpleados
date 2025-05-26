import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { JobTitle } from '../../Models/JobTitle';
import { Respuesta } from '../../Models/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class JobTitlesServiceService {
  http = inject(HttpClient);
  url: string = environment.apiUrl + 'jobTitles/';

  agregar(jobTitle: JobTitle) {
    return this.http.post<Respuesta>(this.url + 'agregar', jobTitle);
  }
  editar(jobTitle: JobTitle) {
    return this.http.post<Respuesta>(this.url + 'editar', jobTitle);
  }
  eliminar(id: number) {
    return this.http.get<Respuesta>(this.url + 'eliminar/' + id);
  }
  mostrar() {
    return this.http.get<JobTitle[]>(this.url + 'mostrar');
  }
  buscar(id: number) {
    return this.http.get<JobTitle>(this.url + 'buscar/' + id);
  }
}
