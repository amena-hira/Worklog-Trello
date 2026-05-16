import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogUsers } from './worklog-users';

describe('WorklogUsers', () => {
  let component: WorklogUsers;
  let fixture: ComponentFixture<WorklogUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorklogUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorklogUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
