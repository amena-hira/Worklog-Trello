import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageProcessing } from './message-processing';

describe('MessageProcessing', () => {
  let component: MessageProcessing;
  let fixture: ComponentFixture<MessageProcessing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageProcessing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageProcessing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
