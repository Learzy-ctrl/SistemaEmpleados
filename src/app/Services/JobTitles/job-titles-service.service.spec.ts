import { TestBed } from '@angular/core/testing';

import { JobTitlesServiceService } from './job-titles-service.service';

describe('JobTitlesServiceService', () => {
  let service: JobTitlesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTitlesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
