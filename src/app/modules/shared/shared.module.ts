import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ReduceProductNamePipe } from './pipes/reduce-product-name.pipe';
import { ProductDetailCardComponent } from './components/product-detail-card/product-detail-card.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { AlertComponent } from './components/alert/alert.component';
import { ModalComponent } from './components/modal/modal.component';
import { SpinnerSmComponent } from './components/spinner-sm/spinner-sm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ProductCardComponent, 
    FilterPanelComponent,
    SpinnerComponent,
    SpinnerSmComponent,
    PaginationComponent,
    ProductDetailCardComponent,
    AlertComponent,
    ModalComponent
  ],
  declarations: [
    ReduceProductNamePipe,
    SpinnerComponent,
    PaginationComponent,
    ProductCardComponent,
    FilterPanelComponent,
    ProductDetailCardComponent,
    StarRatingComponent,
    AlertComponent,
    ModalComponent,
    SpinnerSmComponent
  ]
})
export class SharedModule { }
