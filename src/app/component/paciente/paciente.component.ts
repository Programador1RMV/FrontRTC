import { Component, OnInit} from '@angular/core';
import { Paciente } from './entities';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  
  public paciente:Paciente;
  public form:FormGroup;
  constructor(private _router:ActivatedRoute, private _paciente:PacienteService) {
  }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this._router.params.subscribe(({paciente})=>{
      if(paciente){
        this._paciente.infoPaciente(paciente).subscribe(paciente=>{
          this.paciente = paciente;
        });
      }
    })
  }

}
