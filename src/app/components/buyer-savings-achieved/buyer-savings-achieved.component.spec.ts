import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSavingsAchievedComponent } from './buyer-savings-achieved.component';

describe('BuyerSavingsAchievedComponent', () => {
  let component: BuyerSavingsAchievedComponent;
  let fixture: ComponentFixture<BuyerSavingsAchievedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerSavingsAchievedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSavingsAchievedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
