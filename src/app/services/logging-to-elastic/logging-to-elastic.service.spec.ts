import { TestBed, inject } from '@angular/core/testing';

import { LoggingToElasticService } from './logging-to-server.service';

describe('LoggingToElasticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingToElasticService]
    });
  });

  it('should be created', inject([LoggingToElasticService], (service: LoggingToElasticService) => {
    expect(service).toBeTruthy();
  }));
});
