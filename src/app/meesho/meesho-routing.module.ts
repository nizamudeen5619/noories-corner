import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeeshoProductListComponent } from './meesho-product-list/meesho-product-list.component';

const routes: Routes = [
    {path:'products',component:MeeshoProductListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeeshoRoutingModule { }
