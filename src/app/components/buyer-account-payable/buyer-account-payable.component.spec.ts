import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAccountPayableComponent } from './buyer-account-payable.component';

describe('BuyerAccountPayableComponent', () => {
  let component: BuyerAccountPayableComponent;
  let fixture: ComponentFixture<BuyerAccountPayableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerAccountPayableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerAccountPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
