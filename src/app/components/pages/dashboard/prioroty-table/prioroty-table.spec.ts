import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorotyTable } from './prioroty-table';

describe('PriorotyTable', () => {
  let component: PriorotyTable;
  let fixture: ComponentFixture<PriorotyTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriorotyTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorotyTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
