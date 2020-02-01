import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterIntro1Page } from './after-intro1.page';

describe('AfterIntro1Page', () => {
  let component: AfterIntro1Page;
  let fixture: ComponentFixture<AfterIntro1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterIntro1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterIntro1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
