import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDelete } from './form-delete';

describe('FormDelete', () => {
  let component: FormDelete;
  let fixture: ComponentFixture<FormDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
