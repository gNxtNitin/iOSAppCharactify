import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersRatingPage } from './others-rating.page';

describe('OthersRatingPage', () => {
  let component: OthersRatingPage;
  let fixture: ComponentFixture<OthersRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersRatingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
