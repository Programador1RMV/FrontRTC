import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente } from '../component/paciente/entities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private __http:HttpClient) {}

  public medicOfPatience(bendoc){
    return this.__http.get(`${environment.apiUri}/paciente/${bendoc}/medico`);
  }
  public infoPaciente(bendoc):Observable<Paciente>{
    return this.__http.get<Paciente>(`${environment.apiUri}/paciente/${bendoc}`);
  }
}