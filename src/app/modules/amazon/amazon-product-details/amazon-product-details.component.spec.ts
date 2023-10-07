import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonProductDetailsComponent } from './amazon-product-details.component';

describe('AmazonProductDetailsComponent', () => {
  let component: AmazonProductDetailsComponent;
  let fixture: ComponentFixture<AmazonProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmazonProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazonProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
