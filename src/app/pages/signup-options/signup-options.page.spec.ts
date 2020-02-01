import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOptionsPage } from './signup-options.page';

describe('SignupOptionsPage', () => {
  let component: SignupOptionsPage;
  let fixture: ComponentFixture<SignupOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupOptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
