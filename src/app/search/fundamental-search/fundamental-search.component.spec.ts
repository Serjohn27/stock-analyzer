import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundamentalSearchComponent } from './fundamental-search.component';

describe('FundamentalSearchComponent', () => {
  let component: FundamentalSearchComponent;
  let fixture: ComponentFixture<FundamentalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundamentalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundamentalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
