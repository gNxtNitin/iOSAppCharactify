import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetsBeginPage } from './lets-begin.page';

describe('LetsBeginPage', () => {
  let component: LetsBeginPage;
  let fixture: ComponentFixture<LetsBeginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetsBeginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetsBeginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
