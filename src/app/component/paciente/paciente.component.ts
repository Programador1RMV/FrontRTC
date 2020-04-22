import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Paciente, SesionPaciente } from './entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { ChatService } from 'src/app/services/chat.service';
import { CallComponent } from '../call/call.component';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit,AfterViewInit {
  @ViewChild(CallComponent) llamada:CallComponent;
  public paciente:SesionPaciente;
  public form:FormGroup;
  inLlamada: any;
  constructor(private _router:ActivatedRoute, private _paciente:PacienteService,private _navi:Router,private _chat:ChatService) {
  }
  ngAfterViewInit(): void {
    this.inLlamada = {...this.llamada};
  }

  ngOnInit(): void {
    this.paciente = new SesionPaciente();
    this._router.queryParams.subscribe(params=>{
      this.paciente = <SesionPaciente>params;
    });
  }

  llamadaFinalizada(){
    this._navi.navigate(['encuesta'],{queryParams:{csc:this.paciente.consecutivo},skipLocationChange:true});
  }

  marcarEncuestaComoNoContestada(){
    this._paciente.encuestaNoContestada(this.paciente.consecutivo).subscribe(succ=>succ);
  }

  get inCall():boolean{
    
    return  this.inLlamada.inCall || false;
  }
}
