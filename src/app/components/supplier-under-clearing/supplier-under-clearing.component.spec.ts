import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUnderClearingComponent } from './supplier-under-clearing.component';

describe('SupplierUnderClearingComponent', () => {
  let component: SupplierUnderClearingComponent;
  let fixture: ComponentFixture<SupplierUnderClearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUnderClearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUnderClearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
