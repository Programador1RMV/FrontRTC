import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialHistoriasClinicasComponent } from './historial-historias-clinicas.component';

describe('HistorialHistoriasClinicasComponent', () => {
  let component: HistorialHistoriasClinicasComponent;
  let fixture: ComponentFixture<HistorialHistoriasClinicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialHistoriasClinicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialHistoriasClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
