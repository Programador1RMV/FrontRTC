import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CloseGuard implements CanDeactivate<unknown> {
  async canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Promise<boolean> {
    let {value,dismiss} = await Swal.fire({
      title:'Seguro desea abandonar esta pagina?',
      text:'Puede que se encuentre en medio de una teleconsulta',
      showCancelButton:true
    });
    if(value){
      return true;
    }
    return false;
  }
  
}
