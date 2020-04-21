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
    console.log(this.formulario.teleconsulta);
  }

  ngOnInit(): void {

  }
  cambioPestanaYSeleccionarTeleconsulta($event:Teleconsulta):void{
    this.currentTab = 2;
    this.teleconsultaSeleccionada = $event;
    let {antecedentes,nConsulta,nOperador,consecutivo,cedula} = $event;
    this.formulario.setNotas(antecedentes,nConsulta,nOperador,consecutivo,cedula);
  }
  finServicio(){
    console.log('fin');
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
      text:'Ingrese el número al que desea enviar notificación',
      title:'Número de notificación',
      showCancelButton:false
    });
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
      await this.__medico.updateBencel(this.teleconsultaSeleccionada.consecutivo,value).toPromise();
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
  }
}
