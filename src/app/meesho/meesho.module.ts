import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeeshoProductListComponent } from './meesho-product-list/meesho-product-list.component';
import { SharedModule } from '../shared/shared.module';
import { MeeshoRoutingModule } from './meesho-routing.module';



@NgModule({
  declarations: [
    MeeshoProductListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MeeshoRoutingModule
  ]
})
export class MeeshoModule { }
