import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSidebarComponent } from './buyer-sidebar.component';

describe('BuyerSidebarComponent', () => {
  let component: BuyerSidebarComponent;
  let fixture: ComponentFixture<BuyerSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
