import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils.component';
import { LoadCubeComponent } from './load-cube/load-cube.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[LoadCubeComponent],
  declarations: [UtilsComponent,LoadCubeComponent]
})
export class UtilsModule { }
