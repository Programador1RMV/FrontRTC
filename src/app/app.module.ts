import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallComponent } from './component/call/call.component';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './services/auth.service';
import { NgbNavModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { MedicoComponent } from './component/medico/medico.component';
import { ServiciosComponent } from './component/servicios/servicios.component';
import { FormularioComponent } from './component/formulario/formulario.component';
import { PacienteComponent } from './component/paciente/paciente.component'
@NgModule({
  declarations: [
    AppComponent,
    CallComponent,
    MedicoComponent,
    ServiciosComponent,
    FormularioComponent,
    PacienteComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgbTabsetModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
