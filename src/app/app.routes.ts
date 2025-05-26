import { Routes } from '@angular/router';
import { ListarComponent as EmployeeListarComponent } from './Components/Employees/listar/listar.component';
import { CrearComponent as EmployeeCrearComponent} from './Components/Employees/crear/crear.component';
import { EditarComponent as EmployeeEditarComponent} from './Components/Employees/editar/editar.component';
import { ListarComponent as DepartmentListarComponent } from './Components/Departments/listar/listar.component';
import { CrearComponent as DepartmentCrearComponent } from './Components/Departments/crear/crear.component';
import { EditarComponent as DepartmentEditarComponent} from './Components/Departments/editar/editar.component';
import { ListarComponent as JobTitlesListarComponent} from './Components/JobTitles/listar/listar.component';
import { CrearComponent as JobTitlesCrearComponent} from './Components/JobTitles/crear/crear.component';
import { EditarComponent as JobTitlesEditarComponent} from './Components/JobTitles/editar/editar.component';
import { InicioComponent } from './Components/inicio/inicio.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    { path: 'inicio', component: InicioComponent },
    { path: 'employees/listar', component: EmployeeListarComponent },
    { path: 'employees/crear', component: EmployeeCrearComponent },
    { path: 'employees/editar', component: EmployeeEditarComponent },

    { path: 'departments/listar', component: DepartmentListarComponent },
    { path: 'departments/crear', component: DepartmentCrearComponent },
    { path: 'departments/editar', component: DepartmentEditarComponent },

    { path: 'jobTitles/listar', component: JobTitlesListarComponent },
    { path: 'jobTitles/crear', component: JobTitlesCrearComponent },
    { path: 'jobTitles/editar', component: JobTitlesEditarComponent },
];
