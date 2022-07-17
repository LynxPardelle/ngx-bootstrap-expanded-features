import { TestBed } from '@angular/core/testing';

import { NgxBootstrapExpandedFeaturesService } from './ngx-bootstrap-expanded-features.service';

describe('NgxBootstrapExpandedFeaturesService', () => {
  let service: NgxBootstrapExpandedFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxBootstrapExpandedFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
