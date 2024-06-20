import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerPendingApprovalComponent } from './buyer-pending-approval.component';

describe('BuyerPendingApprovalComponent', () => {
  let component: BuyerPendingApprovalComponent;
  let fixture: ComponentFixture<BuyerPendingApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerPendingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerPendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
