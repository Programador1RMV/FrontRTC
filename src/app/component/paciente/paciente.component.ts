import { Component, OnInit} from '@angular/core';
import { Paciente, SesionPaciente } from './entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  
  public paciente:SesionPaciente;
  public form:FormGroup;
  constructor(private _router:ActivatedRoute, private _paciente:PacienteService) {
  }

  ngOnInit(): void {
    this.paciente = new SesionPaciente();
    this._router.queryParams.subscribe(params=>{
      console.log(params);
      this.paciente = <SesionPaciente>params;
    });
  }

}
