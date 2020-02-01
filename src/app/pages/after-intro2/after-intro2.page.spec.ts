import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterIntro2Page } from './after-intro2.page';

describe('AfterIntro2Page', () => {
  let component: AfterIntro2Page;
  let fixture: ComponentFixture<AfterIntro2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterIntro2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterIntro2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
