import { Component, OnInit, Input } from '@angular/core';
import { Teleconsulta } from '../servicios/entities';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})


export class FormularioComponent implements OnInit {
  @Input()
  teleconsulta?:Teleconsulta;
  constructor() {
    
  }
  ngOnInit(): void {
    this.teleconsulta = new Teleconsulta(); 
  }

}
