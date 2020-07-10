import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teleconsulta } from '../component/servicios/entities';
import { environment } from 'src/environments/environment';
import { Diagnostico } from '../component/medico/entities';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  public photosUrl= environment.phpBack;
  constructor(private _http:HttpClient, private socket:Socket) {}

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
  updateBencel(consecutivo,telefono){
    return this._http.put(`${environment.apiUri}/medicos/servicio/${consecutivo}/bentel`,{telefono});
  }

  finTeleconsulta(csc){
    return this._http.get(`${environment.apiUri}/medicos/finservicio/${csc}`);
  }

  async savePhotos(imagenes:Array<any>,consecutivo,cedulaPaciente){
    return new Promise(async (resolve,reject)=>{

      //Por cada imagen descargarla en formato png y enviarlar al servior
      //Si hay un error dispararlo 
      //Se usa una promesa para poder esperar a que se suban todas las imagenes para terminar el servicio
      try{
        for(let index=0;index<imagenes.length;index++){
          let imagen = imagenes[index];
          let form = new FormData();
          let img = await fetch(imagen);
          let finalImg = await img.blob();
          form.append("file",finalImg);
          form.append("consecutivo",consecutivo);
          form.append("cedulaPaciente",cedulaPaciente);
          form.append("pos",`${index}`);
          await this._http.post(`${this.photosUrl}`,form).toPromise();
        }
        resolve();
      }catch(e){
        reject(e);
      }
    })
  }

  async saveAudio(audio,consecutivo,cedulaPaciente){
    return new Promise(async (resolve,reject)=>{
      //Enviamos el blob de el audio a el servidor para guardarlos
      try{
        let form = new FormData();
        let aud = await fetch(URL.createObjectURL(audio));
        let final = await aud.blob();
        form.append("file",final);
        console.log(final);
        
        form.append("consecutivo",consecutivo);
        form.append("cedulaPaciente",cedulaPaciente);
        await this._http.post(`${this.photosUrl}?video=true`,form).toPromise();
      }catch(e){

      }
    })
  }
}
