import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinatorsComponent } from './combinators.component';

describe('CombinatorsComponent', () => {
  let component: CombinatorsComponent;
  let fixture: ComponentFixture<CombinatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombinatorsComponent]
    });
    fixture = TestBed.createComponent(CombinatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
