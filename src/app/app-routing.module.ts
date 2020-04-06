import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallComponent } from './component/call/call.component';
import { MedicoGuard } from './guards/medico.guard';
import { MedicoComponent } from './component/medico/medico.component';
import { CloseGuard } from './guards/close.guard';
import { FormularioPacienteComponent } from './component/formulario-paciente/formulario-paciente.component';
import { PacienteComponent } from './component/paciente/paciente.component';


const routes: Routes = [
  {
    path:'paciente',children:[
      {path:'', component:FormularioPacienteComponent},
      {path:':medicId/:paciente',component:PacienteComponent}
    ],
  },
  {
    path:'medico',component:MedicoComponent,canActivate:[MedicoGuard],canDeactivate:[CloseGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
