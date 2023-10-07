import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AmazonProductListComponent } from './amazon-product-list/amazon-product-list.component';
import { AmazonProductDetailsComponent } from './amazon-product-details/amazon-product-details.component';

const routes: Routes = [
    {
        path: 'amazon', children: [
            { path: 'products', component: AmazonProductListComponent },
            { path: 'product/:id', component: AmazonProductDetailsComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AmazonRoutingModule { }
