import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueProjectsList } from './overdue-projects-list';

describe('OverdueProjectsList', () => {
  let component: OverdueProjectsList;
  let fixture: ComponentFixture<OverdueProjectsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverdueProjectsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverdueProjectsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
