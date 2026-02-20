import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingDeadline } from './upcoming-deadline';

describe('UpcomingDeadline', () => {
  let component: UpcomingDeadline;
  let fixture: ComponentFixture<UpcomingDeadline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpcomingDeadline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingDeadline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
