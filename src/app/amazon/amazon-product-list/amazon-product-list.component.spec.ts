import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonProductListComponent } from './amazon-product-list.component';

describe('AmazonProductListComponent', () => {
  let component: AmazonProductListComponent;
  let fixture: ComponentFixture<AmazonProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmazonProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazonProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
