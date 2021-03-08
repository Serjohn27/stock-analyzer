import { TestBed } from '@angular/core/testing';

import { FundamentalSearchService } from './fundamental-search.service';

describe('FundamentalSearchService', () => {
  let service: FundamentalSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundamentalSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
