import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedWordsComponent } from './reserved-words.component';

describe('ReservedWordsComponent', () => {
  let component: ReservedWordsComponent;
  let fixture: ComponentFixture<ReservedWordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservedWordsComponent]
    });
    fixture = TestBed.createComponent(ReservedWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
