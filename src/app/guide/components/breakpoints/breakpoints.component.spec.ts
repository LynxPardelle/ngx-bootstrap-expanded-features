import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakpointsComponent } from './breakpoints.component';

describe('BreakpointsComponent', () => {
  let component: BreakpointsComponent;
  let fixture: ComponentFixture<BreakpointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreakpointsComponent]
    });
    fixture = TestBed.createComponent(BreakpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
