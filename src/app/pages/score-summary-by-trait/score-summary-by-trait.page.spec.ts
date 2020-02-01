import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSummaryByTraitPage } from './score-summary-by-trait.page';

describe('ScoreSummaryByTraitPage', () => {
  let component: ScoreSummaryByTraitPage;
  let fixture: ComponentFixture<ScoreSummaryByTraitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreSummaryByTraitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSummaryByTraitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
