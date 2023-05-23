import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeeshoProductListComponent } from './meesho-product-list/meesho-product-list.component';
import { MeeshoProductDetailsComponent } from './meesho-product-details/meesho-product-details.component';

const routes: Routes = [
  { path: 'products', component: MeeshoProductListComponent },
  { path: 'product/:id', component: MeeshoProductDetailsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeeshoRoutingModule { }
