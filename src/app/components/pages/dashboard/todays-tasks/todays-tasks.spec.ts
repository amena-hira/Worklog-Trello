import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysTasks } from './todays-tasks';

describe('TodaysTasks', () => {
  let component: TodaysTasks;
  let fixture: ComponentFixture<TodaysTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodaysTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
