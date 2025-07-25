import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiClassesComponent } from './multi-classes.component';

describe('MultiClassesComponent', () => {
  let component: MultiClassesComponent;
  let fixture: ComponentFixture<MultiClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
