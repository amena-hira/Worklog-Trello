import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityProgress } from './activity-progress';

describe('ActivityProgress', () => {
  let component: ActivityProgress;
  let fixture: ComponentFixture<ActivityProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
