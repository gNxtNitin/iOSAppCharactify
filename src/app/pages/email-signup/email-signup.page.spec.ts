import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignupPage } from './email-signup.page';

describe('EmailSignupPage', () => {
  let component: EmailSignupPage;
  let fixture: ComponentFixture<EmailSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
