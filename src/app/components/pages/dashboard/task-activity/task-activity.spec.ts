import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskActivity } from './task-activity';

describe('TaskActivity', () => {
  let component: TaskActivity;
  let fixture: ComponentFixture<TaskActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
