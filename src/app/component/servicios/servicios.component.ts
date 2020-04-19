import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Teleconsulta } from './entities';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  public teleconsultas:Array<Teleconsulta>;
  @Output() public teleconsultaSeleccionada:EventEmitter<Teleconsulta>;
  @Input() public teleconsulta:Teleconsulta;
  constructor(private _medicos:MedicoService) { 
    this.teleconsultas = [];
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
      console.log(value,teleconsulta,value===teleconsulta);
      if(value === teleconsulta){
        console.log(this.teleconsultas.splice(index,1));
      }
    }
  }

  loadServices(){
    this._medicos.teleconsultas().subscribe(teleconsultas=>{
      this.teleconsultas = teleconsultas;
    });
  }
}
