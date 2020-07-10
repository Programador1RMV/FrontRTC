import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente, SesionPaciente } from '../component/paciente/entities';
import { Observable } from 'rxjs';

import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  constructor(private __http:HttpClient,public wss:Socket) {}
  public medicOfPatience(bendoc):Observable<SesionPaciente>{
    return this.__http.get<SesionPaciente>(`${environment.apiUri}/paciente/${bendoc}/medico`);
  }
  public infoPaciente(bendoc):Observable<Paciente>{
    return this.__http.get<Paciente>(`${environment.apiUri}/paciente/${bendoc}`);
  }

  encuestaNoContestada(csc){
    return this.__http.post(`${environment.apiUri}/paciente/encuestaNoContestada`,{csc});
  }
  
  saveEncuesta(csc,body){

    return this.__http.post(`${environment.apiUri}/paciente/guardarEncuesta`,{csc,...body});
  }

  totalServicios<T>(bendoc):Observable<T>{
    return this.__http.get<T | any>(`${environment.apiUri}/vital/totalconsultas/${bendoc}`);
  }
}