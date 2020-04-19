import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teleconsulta } from '../component/servicios/entities';
import { environment } from 'src/environments/environment';
import { Diagnostico } from '../component/medico/entities';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  
  constructor(private _http:HttpClient) {}

  public teleconsultas():Observable<Array<Teleconsulta>>{
    let documento = localStorage.getItem(`documento`)
    return this._http.get<Array<Teleconsulta>>(`${environment.apiUri}/medicos/${documento}/teleconsulta`)
  }

  diagnosticos(search):Observable<Array<Diagnostico>>{
    return this._http.get<Array<Diagnostico>>(`${environment.apiUri}/diagnosticos/${search}`);
  }

  saveTeleconsulta(body){
    return this._http.post(`${environment.apiUri}/medicos/teleconsulta`,body);
  }

  public sendSMS(csc,telefono?){
    return this._http.get(`${environment.apiUri}/medicos/numero/${csc}/${telefono}`);
  }
}
