import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-paciente',
  templateUrl: './formulario-paciente.component.html',
  styleUrls: ['./formulario-paciente.component.css']
})
export class FormularioPacienteComponent implements OnInit {

  public form:FormGroup;
  public loading:boolean;
  constructor(private _paciente:PacienteService, private router:Router) { 
    this.form = this.newForm();
    this.loading = false;
  }

  ngOnInit() {
  }
  newForm():FormGroup{
    return new FormGroup({
      documento:new FormControl('',[Validators.required]),
      terms:new FormControl('',[Validators.required])
    })
  }

  onSubmit(event:Event):void{
    event.preventDefault();
    this.loading = true;
    this._paciente.medicOfPatience(this.form.value.documento).subscribe(succ=>{
      if(!succ){
        Swal.fire({
          title:'Error',
          icon:'error',
          text:'No se encontró un beneficiario con ese documento con una teleconsulta activa'
        })
      }else{ 
        this.router.navigate(['/paciente',`${succ.documentoMedico}rmv`],{queryParams:{...succ}, skipLocationChange:true});
      }
      this.loading = false;
    })
    
  }
}
