import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',  
})
export class MedicoGuard implements CanActivate {
  isLogged:boolean;
  intentos:number;
  constructor(private auth:AuthService){
    this.isLogged = false;
    this.intentos = 0;
  }
  async canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
    let user  = JSON.parse(localStorage.getItem('user'));
    if(!user){
      do{
        if(this.isLogged){
          return;
        }
        let resp = await Swal.fire({
          icon:'error',
          title:  this.intentos > 0? 'Error al iniciar sesión intenta de nuevo':'No has iniciado sesión' ,
          html:`
            <label for="swal2-input1">Documento</label>
            <input type="text" class="swal2-input" id="swal2-input1">
            <label for="swal2-input1">Contraseña</label>
            <input type="password" class="swal2-input" id="swal2-input2">
          `,
          preConfirm: ()=>{
            let inputs = <NodeListOf<HTMLInputElement>>document.querySelectorAll('.swal2-input');
            return [
              inputs[0].value,
              inputs[1].value,
            ]
          }          
        });
        if(!resp.dismiss){
          let conti = await this.auth.authMedic({username:resp.value[0], password:resp.value[1]}).toPromise();
          if(conti.length > 0){
            localStorage.setItem('documento', conti[0].id_usuario);
            localStorage.setItem('user',JSON.stringify({name:conti[0].nombre}));
          }
          if(conti.length > 0) return true;
        }
      }while(!this.isLogged);
    }
    return true;
    
  }
  
}
