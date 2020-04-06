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
import { FormularioPacienteComponent } from './component/formulario-paciente/formulario-paciente.component';
import { UtilsModule } from './utils/utils.module';
@NgModule({
  declarations: [
    AppComponent,
    CallComponent,
    MedicoComponent,
    ServiciosComponent,
    FormularioComponent,
    PacienteComponent,
    FormularioPacienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgbTabsetModule,
    UtilsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
