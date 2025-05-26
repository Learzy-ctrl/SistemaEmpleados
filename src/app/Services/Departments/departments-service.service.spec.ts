import { TestBed } from '@angular/core/testing';

import { DepartmentsServiceService } from './departments-service.service';

describe('DepartmentsServiceService', () => {
  let service: DepartmentsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
