import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallComponent } from './component/call/call.component';
import { MedicoGuard } from './guards/medico.guard';


const routes: Routes = [
  {
    path:'beneficiario/:medicId/:reqcsc',component:CallComponent,
  },
  {
    path:'medico',component:CallComponent,canActivate:[MedicoGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
