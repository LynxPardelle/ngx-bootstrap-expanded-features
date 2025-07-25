import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingLibraryComponent } from './testing-library.component';

describe('TestingLibraryComponent', () => {
  let component: TestingLibraryComponent;
  let fixture: ComponentFixture<TestingLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
