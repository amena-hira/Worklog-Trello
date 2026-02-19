import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calender } from './calender';

describe('Calender', () => {
  let component: Calender;
  let fixture: ComponentFixture<Calender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Calender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
