import { TestBed } from '@angular/core/testing';

import { TechnicalSearchService } from './technical-search.service';

describe('TechnicalSearchService', () => {
  let service: TechnicalSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnicalSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
