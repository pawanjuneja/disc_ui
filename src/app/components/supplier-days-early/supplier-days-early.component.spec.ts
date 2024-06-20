import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDaysEarlyComponent } from './supplier-days-early.component';

describe('SupplierDaysEarlyComponent', () => {
  let component: SupplierDaysEarlyComponent;
  let fixture: ComponentFixture<SupplierDaysEarlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierDaysEarlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierDaysEarlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
