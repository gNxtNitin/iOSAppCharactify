import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfRatingPage } from './self-rating.page';

describe('SelfRatingPage', () => {
  let component: SelfRatingPage;
  let fixture: ComponentFixture<SelfRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfRatingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
