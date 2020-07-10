import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Teleconsulta } from '../servicios/entities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicoService } from 'src/app/services/medico.service';
import { Diagnostico } from '../medico/entities';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})


export class FormularioComponent implements OnInit,AfterViewInit{
  @Input()
  teleconsulta?:Teleconsulta;
  @Input() audioLlamada:any;
  public diagnosticos:Array<Diagnostico>;
  public formulario:FormGroup;
  public tiempoTranscurrido;
  public contador;
  //Campo que dice si se está seleccionando un CIE10
  public cie10:boolean;
  public imagenes:Array<any>;
  @Output() finConsulta:EventEmitter<string>;
  @Output() saveAudio: EventEmitter<any>;
  constructor(private _medico:MedicoService) {
    this.audioLlamada = null;
    this.saveAudio = new EventEmitter();
    this.cie10 = false;
    this.tiempoTranscurrido = '';
    this.audioLlamada = null;
    this.finConsulta = new EventEmitter<string>();
    this.formulario = this.newForm();
    this.imagenes = [];
  }
  ngAfterViewInit(): void {
    this.imagenes = [];
  }
  ngOnInit(): void {
    this.teleconsulta = new Teleconsulta();
    this.formulario = this.newForm();
    this.onChanges();
    this.imagenes = [];
  }
  
  async onChanges(){
    await this._medico.saveTeleconsulta(this.formulario.value).toPromise();
  }

  newForm({antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente,bencel,bentel}={antecedentes:null,nConsulta:null,nOperador:null,consecutivo:null,cedulaCliente:null,bencel:null,bentel:null}):FormGroup{
    let medico = localStorage.getItem("documento");
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
      cedulaCliente:new FormControl(cedulaCliente),
      horaInicio:new FormControl(null),
      novedades:new FormControl(null),
      bencel:new FormControl(bencel),
      bentel:new FormControl(bentel),
      medico:new FormControl(medico)
    })
  }
  setNotas(antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente,bencel,bentel){
    this.formulario = this.newForm({antecedentes,nConsulta,nOperador,consecutivo,cedulaCliente,bencel,bentel});
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

  async finalizarConsulta(){
    let value = this.formulario.value;
    
    if(value.consecutivo === undefined || value.consecutivo === null){
      Swal.fire('Error','debes de tener una teleconsulta activa para poder finalizarla','error');
      return;
    }
    await this._medico.savePhotos(this.imagenes,this.teleconsulta.consecutivo,this.teleconsulta.cedula);
    let {value:confirmar,dismiss} = await Swal.fire({
      icon:'question',
      title:'Seguro desea realizar esta acción?',
      text:'Se finalizará la consulta',
      showCancelButton:true
    });
    if(confirmar){

      this._medico.saveTeleconsulta(this.formulario.value).subscribe(resp=>{
        this.formulario = this.newForm();
        this.saveAudio.emit({cedula:this.teleconsulta.cedula,csc:this.teleconsulta.consecutivo})
        this._medico.finTeleconsulta(this.formulario.value.consecutivo).subscribe(succ=>succ);
        this.finConsulta.emit(this.audioLlamada);
        clearInterval(this.contador);
      });
    }
    
  }

  iniciarTemporizador(){
    this.contador = setInterval(()=>{
      let min = moment().diff(this.formulario.get('horaInicio').value,'minutes');
      let sec = Math.round(moment().diff(this.formulario.get('horaInicio').value,'seconds') % 60);
      this.tiempoTranscurrido = `${min}:${sec < 10 ?`0${sec}`:sec }`;
    })
  }
}
