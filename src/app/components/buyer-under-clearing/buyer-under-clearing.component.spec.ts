import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerUnderClearingComponent } from './buyer-under-clearing.component';

describe('BuyerUnderClearingComponent', () => {
  let component: BuyerUnderClearingComponent;
  let fixture: ComponentFixture<BuyerUnderClearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerUnderClearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerUnderClearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
