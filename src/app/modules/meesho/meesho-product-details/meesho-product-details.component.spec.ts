import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeeshoProductDetailsComponent } from './meesho-product-details.component';

describe('MeeshoProductDetailsComponent', () => {
  let component: MeeshoProductDetailsComponent;
  let fixture: ComponentFixture<MeeshoProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeeshoProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeeshoProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
