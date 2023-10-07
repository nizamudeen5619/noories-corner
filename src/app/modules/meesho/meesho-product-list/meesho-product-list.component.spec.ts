import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeeshoProductListComponent } from './meesho-product-list.component';

describe('MeeshoProductListComponent', () => {
  let component: MeeshoProductListComponent;
  let fixture: ComponentFixture<MeeshoProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeeshoProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeeshoProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
