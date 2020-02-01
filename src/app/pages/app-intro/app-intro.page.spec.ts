import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIntroPage } from './app-intro.page';

describe('AppIntroPage', () => {
  let component: AppIntroPage;
  let fixture: ComponentFixture<AppIntroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIntroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
