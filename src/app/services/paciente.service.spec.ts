/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PacienteService } from './paciente.service';

describe('Service: Paciente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PacienteService]
    });
  });

  it('should ...', inject([PacienteService], (service: PacienteService) => {
    expect(service).toBeTruthy();
  }));
});
