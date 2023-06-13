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
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ModalComponent } from './components/modal/modal.component';


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
    PaginationComponent,
    ProductDetailCardComponent,
    ServerErrorComponent
  ],
  declarations: [
    ReduceProductNamePipe,
    SpinnerComponent,
    PaginationComponent,
    ProductCardComponent,
    FilterPanelComponent,
    ProductDetailCardComponent,
    StarRatingComponent,
    ServerErrorComponent,
    ModalComponent
  ]
})
export class SharedModule { }
