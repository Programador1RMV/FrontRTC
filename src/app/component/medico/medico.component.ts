import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { Teleconsulta } from '../servicios/entities';

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
  @ViewChild(FormularioComponent ) formulario:FormularioComponent
  constructor() { 
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
  }
}
