import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { PacienteService } from 'src/app/services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {
  public form:FormGroup;
  public preguntas:Array<{pregunta:string,valoracion:number,campo:string}>;
  responsable: SweetAlertResult;
  public csc:string;
  public keysAndValues = [
    {value:1,tooltip:'😢',},
    {value:2,tooltip: '🙁'},
    {value:3,tooltip: '😧'},
    {value:4,tooltip: '🙂'},
    {value:5,tooltip: '😁'},
  ]
  constructor(private __paciente:PacienteService, private __route:ActivatedRoute,private router:Router) { 
    this.preguntas = [{pregunta:'Qué valoración le da al operador?',valoracion:0,campo:'calConsultaOpe'},{pregunta:'Qué valoración le da al auxiliar?',valoracion:0,campo:'calConsultaAux'},{pregunta:'Qué valoración le da al médico?',valoracion:0,campo:'calConsultaMed'}];
    this.form = new FormGroup({
      encargado:new FormControl(null),
      preguntas: new FormArray([])
    });
    this.preguntas.map(pregunta=>{
      this.pregs.push(this.createFormGroup(pregunta));
    });
    this.__route.queryParams.subscribe(params=>{
      this.csc = params.csc;
    })
  }

  async ngOnInit(){
    await this.modalResponsable();
  }

  createFormArray(){
    return new FormArray([])
  }

  createFormGroup({pregunta,valoracion,campo}={pregunta:'',valoracion:0,campo:''}){
    return new FormGroup({
      pregunta: new FormControl(pregunta),
      valoracion:new FormControl(valoracion,[Validators.required]),
      campo:new FormControl(campo)
    })
  }

  async modalResponsable(){
    const items = [ 
      { id: 0, name: "Paciente" },
      { id: 1, name: "Persona a cargo" },
    ]
    
    const inputOptions = new Map
    items.forEach(item => inputOptions.set(item.id, item.name))
    this.responsable = await Swal.fire({
      icon:'question',
      title:'La consulta ha finalizado, a continuación le haremos una pequeña encuesta',
      text:'¿Quién es la persona que va a constestar esta encuesta?',
      input:'select',
      inputOptions,
      showCancelButton:true,
      cancelButtonText:'No deseo hacer la encuesta',
      backdrop:false
    });
    if(this.responsable.dismiss){
      this.router.navigate(['/thanks']);
      return;
    }
    this.form.get('encargado').setValue(this.responsable.value);
  }

  get pregs():FormArray{
    return this.form.get('preguntas') as FormArray
  }

  saveEncuesta(){
    this.__paciente.saveEncuesta(this.csc,this.form.value).subscribe(succ=>{
      this.router.navigate(['/thanks']);
    });
  }

  showGrats():Promise<SweetAlertResult>{
    return Swal.fire({
      title:'Listo!',
      text:'Gracias por su tiempo',
      icon:'success',
      showConfirmButton:false,
      width:'100vw'
    })
  }
}
