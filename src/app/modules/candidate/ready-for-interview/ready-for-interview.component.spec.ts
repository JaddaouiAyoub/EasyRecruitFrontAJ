import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyForInterviewComponent } from './ready-for-interview.component';

describe('ReadyForInterviewComponent', () => {
  let component: ReadyForInterviewComponent;
  let fixture: ComponentFixture<ReadyForInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadyForInterviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadyForInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
