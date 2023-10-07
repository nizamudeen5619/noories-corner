import { TestBed } from '@angular/core/testing';

import { MeeshoService } from './meesho.service';

describe('MeeshoService', () => {
  let service: MeeshoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeeshoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
