import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Paciente, SesionPaciente } from './entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { ChatService } from 'src/app/services/chat.service';
import { CallComponent } from '../call/call.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit,AfterViewInit {
  @ViewChild(CallComponent) llamada:CallComponent;
  public paciente:SesionPaciente;
  public form:FormGroup;
  public consecutivo:string;
  inLlamada: any;
  constructor(private _router:ActivatedRoute, private _paciente:PacienteService,private _navi:Router,private _chat:ChatService) {
  }
  ngAfterViewInit(): void {
    this.inLlamada = {...this.llamada};
  }

  ngOnInit(): void {
    this._router.queryParams.subscribe(suscc=>{
      this.consecutivo = suscc.consecutivo;
    })
    this.paciente = new SesionPaciente();
    this._router.queryParams.subscribe(params=>{
      this.paciente = <SesionPaciente>params;
    });
  }

  async llamadaFinalizada(){
    this.llamada.colgar();
    this._navi.navigate(['encuesta'],{queryParams:{csc:this.paciente.consecutivo},skipLocationChange:true});
  }

  marcarEncuestaComoNoContestada(){
    this._paciente.encuestaNoContestada(this.paciente.consecutivo).subscribe(succ=>succ);
  }

  get inCall():boolean{
    let llamada = {...this.llamada};
    return  llamada.inCall || false;
  }

  async colgar(){
    let {value,dismiss} = await Swal.fire({
      icon:'question',
      title:'Seguro desea salir?',
      text:'Si sale de esta conferencia se finalizará su consulta',
      showCancelButton:true
    });
    if(value){
      this.llamada.colgar();
      this._navi.navigate(['encuesta'],{queryParams:{csc:this.paciente.consecutivo},skipLocationChange:true});
    }
  }
}
