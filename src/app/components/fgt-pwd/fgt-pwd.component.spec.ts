import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FgtPwdComponent } from './fgt-pwd.component';

describe('FgtPwdComponent', () => {
  let component: FgtPwdComponent;
  let fixture: ComponentFixture<FgtPwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FgtPwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FgtPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
