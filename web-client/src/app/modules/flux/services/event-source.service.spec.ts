import { TestBed, inject } from '@angular/core/testing';

import { EventSourceService } from './event-source.service';

describe('EventSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventSourceService]
    });
  });

  it('should be created', inject([EventSourceService], (service: EventSourceService) => {
    expect(service).toBeTruthy();
  }));
});
