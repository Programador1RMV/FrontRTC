import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Diagnostico } from '../medico/entities';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.scss']
})
export class DiagnosticoComponent implements OnInit {
  @Output() seleccionado:EventEmitter<Diagnostico | void>;
  public diagnosticos:Array<Diagnostico>;
  public page:number;
  public busqueda:string;
  constructor(private _medico:MedicoService) {
    this.page = 0;
    this.seleccionado = new EventEmitter<Diagnostico | void>();
  }

  ngOnInit(): void {
  }

  public seleccionar(diagnostico:Diagnostico){
    this.seleccionado.emit(diagnostico);
  }

  close(){
    this.seleccionado.emit();
  }

  buscar(event?){
    this.page = 0;
    console.log('buscar');
    this._medico.diagnosticos(this.busqueda).subscribe(diags => this.diagnosticos = diags);
  }

  @HostListener('document:keydown.escape', ['$event']) 
  onKeydownHandler(event:KeyboardEvent) {
    this.close();
  }
}
