<<<<<<< HEAD:src/app/modules/recruiter/components/interviews/interviews-list/interviews-list.component.spec.ts
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewFormComponent } from './interview-form.component';

describe('InterviewFormComponent', () => {
  let component: InterviewFormComponent;
  let fixture: ComponentFixture<InterviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterviewFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> 5528ab77c3854f65e586ceeb3d74df78824da276:src/app/modules/recruiter/components/interview/interview-form/interview-form.component.spec.ts
