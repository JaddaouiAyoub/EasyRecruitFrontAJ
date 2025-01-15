import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTrackingComponent } from './application-tracking.component';

describe('ApplicationTrackingComponent', () => {
  let component: ApplicationTrackingComponent;
  let fixture: ComponentFixture<ApplicationTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
