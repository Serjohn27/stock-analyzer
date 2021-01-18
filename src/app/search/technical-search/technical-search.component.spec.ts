import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSearchComponent } from './technical-search.component';

describe('TechnicalSearchComponent', () => {
  let component: TechnicalSearchComponent;
  let fixture: ComponentFixture<TechnicalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
