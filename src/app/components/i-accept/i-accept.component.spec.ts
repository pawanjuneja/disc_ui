import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IAcceptComponent } from './i-accept.component';

describe('IAcceptComponent', () => {
  let component: IAcceptComponent;
  let fixture: ComponentFixture<IAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
