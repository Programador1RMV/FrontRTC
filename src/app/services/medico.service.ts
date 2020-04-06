import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teleconsulta } from '../component/servicios/entities';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  
  constructor(private _http:HttpClient) {}

  public teleconsultas():Observable<Array<Teleconsulta>>{
    let documento = localStorage.getItem(`documento`)
    return this._http.get<Array<Teleconsulta>>(`${environment.apiUri}/medicos/${documento}/teleconsulta`)
  }
}
