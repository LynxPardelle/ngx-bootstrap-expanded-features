import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowsComponent } from './shadows.component';

describe('ShadowsComponent', () => {
  let component: ShadowsComponent;
  let fixture: ComponentFixture<ShadowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShadowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShadowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
