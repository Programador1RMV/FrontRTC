import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { Teleconsulta } from '../servicios/entities';
import { CallComponent } from '../call/call.component';
import { ServiciosComponent } from '../servicios/servicios.component';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { ChatService } from 'src/app/services/chat.service';

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
    this.__chat.chat.subscribe(mensaje=>{
      console.log(mensaje);
    })
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
    this.llamada.colgar();
  }

  cerrarSesion(){
    localStorage.clear();
    window.location.reload();
  }

  enviarMensjaePaciente(){
    console.log(this.teleconsultaSeleccionada.bencel,this.teleconsultaSeleccionada.consecutivo);
    if(this.teleconsultaSeleccionada.bencel !== null && this.teleconsultaSeleccionada.bencel !== undefined ){
      this.__medico.sendSMS(this.teleconsultaSeleccionada.consecutivo).subscribe(succ=>{
        Swal.fire({
          timer:2000,
          title:'Exito',
          text:'Enviamos con exito el enlace al paciente',
          showConfirmButton:false
        })
      });
    }
  }

  setMessage(value){
    this.formulario.formulario.get("mensajes").setValue(value);
  }
}
