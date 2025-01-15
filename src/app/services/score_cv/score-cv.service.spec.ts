import { TestBed } from '@angular/core/testing';

import { ScoreCvService } from './score-cv.service';

describe('ScoreCvService', () => {
  let service: ScoreCvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreCvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
