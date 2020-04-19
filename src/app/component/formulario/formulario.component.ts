import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Teleconsulta } from '../servicios/entities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicoService } from 'src/app/services/medico.service';
import { Diagnostico } from '../medico/entities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})


export class FormularioComponent implements OnInit {
  @Input()
  teleconsulta?:Teleconsulta;
  public diagnosticos:Array<Diagnostico>;
  public formulario:FormGroup;
  //Campo que dice si se está seleccionando un CIE10
  public cie10:boolean;
  @Output() finConsulta:EventEmitter<string>;
  constructor(private _medico:MedicoService) {
    this.cie10 = false;
    this.finConsulta = new EventEmitter<string>();
  }
  ngOnInit(): void {
    this.teleconsulta = new Teleconsulta();
    this.formulario = this.newForm();
  }

  newForm({antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente}={antecedentes:null,nConsulta:null,nOperador:null,consecutivo:null,cedulaCliente:null}):FormGroup{
    return new FormGroup({
      consecutivo:new FormControl(consecutivo),
      antecedentes:new FormControl(antecedentes),
      nConsulta:new FormControl(nConsulta),
      nOperador:new FormControl(nOperador),
      tratamiento:new FormControl(null),
      asignarDespacho:new FormControl(false),
      requiereSeguimiento:new FormControl(false),
      diagnostico:new FormControl(null),
      mensajes:new FormControl(null),
      cedulaCliente:new FormControl(cedulaCliente)
    })
  }
  setNotas(antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente){
    this.formulario = this.newForm({antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente});
  }

  saveCie10(evento:Diagnostico){
    if(evento !== null && evento !== undefined ){
      this.formulario.controls['diagnostico'].setValue(evento.cod);

    }
    this.cie10 = false;
  }

  onSubmit(event){
    this.formulario.controls['tratamiento'].markAsTouched();
  }

  finalizarConsulta(){
    let value = this.formulario.value;
    if(value.consecutivo === undefined || value.consecutivo === null){
      Swal.fire('Error','debes de tener una teleconsulta activa para poder finalizarla','error');
      return;
    }
    
    this._medico.saveTeleconsulta(this.formulario.value).subscribe(resp=>{
      this.finConsulta.emit();
    });
    this.formulario = this.newForm();
    
  }
}
