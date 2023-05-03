import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmazonProductListComponent } from './amazon-product-list/amazon-product-list.component';
import { SharedModule } from '../shared/shared.module';
import { AmazonRoutingModule } from './amazon-routing.module';
import { AmazonProductDetailsComponent } from './amazon-product-details/amazon-product-details.component';
import { FormsModule } from '@angular/forms';
import { ServerErrorComponent } from './server-error/server-error.component';

@NgModule({
  declarations: [
    AmazonProductListComponent,
    AmazonProductDetailsComponent,
    ServerErrorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AmazonRoutingModule
  ]
})
export class AmazonModule { }
