import { Component, OnInit} from '@angular/core';
import { Paciente, SesionPaciente } from './entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  
  public paciente:SesionPaciente;
  public form:FormGroup;
  constructor(private _router:ActivatedRoute, private _paciente:PacienteService,private _navi:Router,private _chat:ChatService) {
  }

  ngOnInit(): void {
    this.paciente = new SesionPaciente();
    this._router.queryParams.subscribe(params=>{
      console.log(params);
      this.paciente = <SesionPaciente>params;
    });
  }

  llamadaFinalizada(){
    this._navi.navigate(['encuesta'],{queryParams:{csc:this.paciente.consecutivo},skipLocationChange:true});
  }

  marcarEncuestaComoNoContestada(){
    this._paciente.encuestaNoContestada(this.paciente.consecutivo).subscribe(succ=>succ);
  }
}
