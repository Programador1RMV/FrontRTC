import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService{
    constructor(private _http:HttpClient){}
    authMedic(userdata:{username:string,password:string}):Observable<Array<{id_usuario:string,nombre:string}>>{
        return this._http.post<Array<{id_usuario:string,nombre:string}>>(`${environment.apiUri}/medicos/auth`,userdata);
    }
}