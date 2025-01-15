import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSectionComponent } from './signup-section.component';

describe('SignupSectionComponent', () => {
  let component: SignupSectionComponent;
  let fixture: ComponentFixture<SignupSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
