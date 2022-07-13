import { TestBed } from '@angular/core/testing';

import { ConfirmedCasesServiceService } from './confirmed-cases-service.service';

describe('ConfirmedCasesServiceService', () => {
  let service: ConfirmedCasesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmedCasesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
