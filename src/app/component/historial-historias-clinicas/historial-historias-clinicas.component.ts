import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PacienteService } from 'src/app/services/paciente.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-historial-historias-clinicas',
  templateUrl: './historial-historias-clinicas.component.html',
  styleUrls: ['./historial-historias-clinicas.component.scss']
})
export class HistorialHistoriasClinicasComponent implements OnInit {
  @Input() modalRef:BsModalRef;
  @Input() bendoc:string;

  //DataTable
  public dtOptions;
  public tableOpt;
  @ViewChild(DataTableDirective, { static: true })
  tabla: DataTableDirective;
  public dtTrigger: Subject<void>

  constructor(private _pacienteS: PacienteService)
  { 
    this.dtTrigger = new Subject();
    this.dtTrigger.next();
    this.tableOpt = [];
  }

  ngOnInit() {

    this.getServicios();
    this.dtOptions = {
      scrollY: '383px',
      lengthMenu: false,
      responsive: {
        details: {
            type: 'column',
            target: -1
        }
      },
      columnDefs: [ 
          {
              className: 'control',
              orderable: false,
              targets:   -1
          }
      ],
      lengthChange: false,
      pageLength: 10,
      scrollCollapse: true,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior"
        }
      }
    };
  }

  getServicios(){
    this._pacienteS.totalServicios(this.bendoc).subscribe((data: any) => {
      this.tableOpt = data;
      this.dtTrigger.next();
    });
  }

  public renderer() {
    this.tabla.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  close(){
    this.modalRef.hide();
  }

}
