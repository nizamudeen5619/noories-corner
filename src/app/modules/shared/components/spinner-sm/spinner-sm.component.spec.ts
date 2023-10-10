import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerSmComponent } from './spinner-sm.component';

describe('SpinnerSmComponent', () => {
  let component: SpinnerSmComponent;
  let fixture: ComponentFixture<SpinnerSmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerSmComponent]
    });
    fixture = TestBed.createComponent(SpinnerSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
