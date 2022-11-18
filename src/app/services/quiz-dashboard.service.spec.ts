import { TestBed } from '@angular/core/testing';

import { QuizDashboardService } from './quiz-dashboard.service';

describe('QuizDashboardService', () => {
  let service: QuizDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
