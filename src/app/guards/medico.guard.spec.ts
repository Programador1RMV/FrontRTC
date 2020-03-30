import { TestBed } from '@angular/core/testing';

import { MedicoGuard } from './medico.guard';

describe('MedicoGuard', () => {
  let guard: MedicoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MedicoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
