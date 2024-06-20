import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDiscountSetterComponent } from './buyer-discount-setter.component';

describe('BuyerDiscountSetterComponent', () => {
  let component: BuyerDiscountSetterComponent;
  let fixture: ComponentFixture<BuyerDiscountSetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerDiscountSetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerDiscountSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
