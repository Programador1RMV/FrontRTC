import { Component, OnInit, Output, EventEmitter, Input, TemplateRef } from '@angular/core';
import { Teleconsulta } from './entities';
import { MedicoService } from 'src/app/services/medico.service';
import { HistorialHistoriasClinicasComponent } from '../historial-historias-clinicas/historial-historias-clinicas.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  public teleconsultas:Array<Teleconsulta>;
  @Output() public teleconsultaSeleccionada:EventEmitter<Teleconsulta>;
  @Input() public teleconsulta:Teleconsulta;
  public modalBendoc:string;
  public modalRef:BsModalRef;
  constructor(private _medicos:MedicoService, private _modalS:BsModalService) { 
    this.teleconsultas = [];
    this.modalBendoc = "";

    this.teleconsultaSeleccionada = new EventEmitter<Teleconsulta>();
  }
  
  
  ngOnInit(): void {
    this.loadServices();
    this.teleconsulta = new Teleconsulta();
  }

  seleccionarTeleconsulta(teleconsulta:Teleconsulta){
    this.teleconsultaSeleccionada.emit(teleconsulta);
  }

  finalizarServicio(teleconsulta:Teleconsulta){
    for(let [index,value] of this.teleconsultas.entries()){
      if(value === teleconsulta){
      }
    }
  }

  loadServices(){
    this._medicos.teleconsultas().subscribe(teleconsultas=>{
      this.teleconsultas = teleconsultas;
    });
  }

  abrirModal(ref:TemplateRef<any>,bendoc){
    this.modalBendoc = bendoc;
    this.modalRef = this._modalS.show(ref,{
      animated:true,
      class:'modal-lg'
    });
  }
}
