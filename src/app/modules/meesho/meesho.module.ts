import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MeeshoRoutingModule } from './meesho-routing.module';

import { MeeshoProductDetailsComponent } from './meesho-product-details/meesho-product-details.component';
import { MeeshoProductListComponent } from './meesho-product-list/meesho-product-list.component';

@NgModule({
  declarations: [
    MeeshoProductListComponent,
    MeeshoProductDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MeeshoRoutingModule
  ]
})
export class MeeshoModule { }
