import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPaymentDatesComponent } from './set-payment-dates.component';

describe('SetPaymentDatesComponent', () => {
  let component: SetPaymentDatesComponent;
  let fixture: ComponentFixture<SetPaymentDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPaymentDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPaymentDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
