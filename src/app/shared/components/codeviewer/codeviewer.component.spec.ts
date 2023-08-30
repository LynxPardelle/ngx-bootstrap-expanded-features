import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeviewerComponent } from './codeviewer.component';

describe('CodeviewerComponent', () => {
  let component: CodeviewerComponent;
  let fixture: ComponentFixture<CodeviewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeviewerComponent]
    });
    fixture = TestBed.createComponent(CodeviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
