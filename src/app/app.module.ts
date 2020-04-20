import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSelectModule } from 'ngx-select-ex';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallComponent } from './component/call/call.component';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './services/auth.service';
import { NgbNavModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MedicoComponent } from './component/medico/medico.component';
import { ServiciosComponent } from './component/servicios/servicios.component';
import { FormularioComponent } from './component/formulario/formulario.component';
import { PacienteComponent } from './component/paciente/paciente.component'
import { FormularioPacienteComponent } from './component/formulario-paciente/formulario-paciente.component';
import { UtilsModule } from './utils/utils.module';
import { EncuestaComponent } from './component/encuesta/encuesta.component';
import { DiagnosticoComponent } from './component/diagnostico/diagnostico.component';
import { SocketIoModule, Socket } from 'ngx-socket-io';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
@NgModule({
  declarations: [
    AppComponent,
    CallComponent,
    MedicoComponent,
    ServiciosComponent,
    FormularioComponent,
    PacienteComponent,
    FormularioPacienteComponent,
    EncuestaComponent,
    DiagnosticoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgbTabsetModule,
    UtilsModule,
    NgxSelectModule,
    NgxPaginationModule,
    NgbTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
