import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProjectTask } from './form-project-task';

describe('FormProjectTask', () => {
  let component: FormProjectTask;
  let fixture: ComponentFixture<FormProjectTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormProjectTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProjectTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
