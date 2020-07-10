import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { Teleconsulta } from '../servicios/entities';
import { CallComponent } from '../call/call.component';
import { ServiciosComponent } from '../servicios/servicios.component';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { ChatService } from 'src/app/services/chat.service';
import * as moment from 'moment';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent implements OnInit,AfterViewInit {
  public currentTab:number;
  public medico:string;
  public documento:string;
  public teleconsultaSeleccionada:Teleconsulta;
  @ViewChild(FormularioComponent ) formulario:FormularioComponent;
  @ViewChild(CallComponent) llamada:CallComponent;
  @ViewChild(ServiciosComponent) servicios:ServiciosComponent;
  constructor(private __medico:MedicoService,private __chat:ChatService) { 
    this.currentTab = 1;
    this.documento = localStorage.getItem("documento");
    this.medico = JSON.parse(localStorage.getItem("user")).name;
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {

  }
  cambioPestanaYSeleccionarTeleconsulta($event:Teleconsulta):void{
    this.currentTab = 2;
    this.teleconsultaSeleccionada = $event;
    let {antecedentes,nConsulta,nOperador,consecutivo,cedula,bencel,bentel} = $event;
    this.formulario.setNotas(antecedentes,nConsulta,nOperador,consecutivo,cedula,bencel,bentel);
  }
  async finServicio(){
    this.servicios.finalizarServicio(this.teleconsultaSeleccionada);
    this.teleconsultaSeleccionada = new Teleconsulta();
    this.llamada.colgar();
  }

  cerrarSesion(){
    localStorage.clear();
    window.location.reload();
  }

  async enviarMensjaePaciente(){
    let {value,dismiss}= await Swal.fire({
      input:'tel',
      inputValue:this.teleconsultaSeleccionada.bencel,
      text:'Ingrese el número al que desea enviar notificación',
      title:'Número de notificación',
      showCancelButton:false
    });
    if(dismiss){
      return;
    }
    if(!dismiss){
      let {value:valor, dismiss:cerrado } = await Swal.fire({
        title:'Enviar enlace',
        text:`Está seguro de enviar enlace de la consulta al numero ${value}?`,
        showCancelButton:true,
        cancelButtonText:'No enviar'
      });
      if(cerrado){
        return;
      }
      const result = await this.__medico.updateBencel(this.teleconsultaSeleccionada.consecutivo,value).toPromise();
      this.teleconsultaSeleccionada.bencel = value;
    }
    this.__medico.sendSMS(this.teleconsultaSeleccionada.consecutivo,this.teleconsultaSeleccionada.bencel).subscribe(succ=>{
      Swal.fire({
        timer:2000,
        title:'Exito',
        text:'Enviamos con exito el enlace al paciente',
        showConfirmButton:false
      })
    });
  }

  setMessage(value){
    this.formulario.formulario.get("mensajes").setValue(value);
  }

  setStartHour(){
    this.formulario.formulario.get('horaInicio').setValue(moment());
    this.formulario.iniciarTemporizador();
  }

  markAsConnected(csc){
    if(this.teleconsultaSeleccionada !== undefined){
      if(this.teleconsultaSeleccionada.consecutivo == csc){
        this.teleconsultaSeleccionada.teleconsultaActiva = true;
      }
    }

    for(let i=0;i<this.servicios.teleconsultas.length;i++){
      let teleconsulta = this.servicios.teleconsultas[i];
      if(teleconsulta.consecutivo == csc){
        this.servicios.teleconsultas[i].teleconsultaActiva = true;
      }
    }
  }

  addImagen($event){
    this.formulario.imagenes.push($event);
  }

  get photos(){
    return this.formulario === undefined ? [] : this.formulario.imagenes;
  }

  async colgar($event){
    let {value,dismiss} = await Swal.fire({
      icon:'question',
      title:'Seguro desea salir?',
      text:'Si sale de esta conferencia se finalizará su consulta',
      showCancelButton:true
    });
    
    if(value){
      this.__medico.saveAudio($event,this.teleconsultaSeleccionada.consecutivo,this.teleconsultaSeleccionada.cedula);
      this.llamada.colgar();
    }
  }

  setPausedCall(){
    
  }

  async saveAudio($event:{csc:string,cedula:string}){
    
    this.__medico.saveAudio(await this.llamada.getAudio(),$event.csc,$event.cedula);
  }
}
