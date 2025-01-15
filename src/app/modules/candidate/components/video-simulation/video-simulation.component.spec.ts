import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSimulationComponent } from './video-simulation.component';

describe('VideoSimulationComponent', () => {
  let component: VideoSimulationComponent;
  let fixture: ComponentFixture<VideoSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoSimulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
