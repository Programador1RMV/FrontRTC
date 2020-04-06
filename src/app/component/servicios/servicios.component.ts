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
    this._medicos.teleconsultas().subscribe(teleconsultas=>{
      this.teleconsultas = teleconsultas;
    });
    this.teleconsulta = new Teleconsulta();
  }

  seleccionarTeleconsulta(teleconsulta:Teleconsulta){
    this.teleconsultaSeleccionada.emit(teleconsulta);
  }

}
