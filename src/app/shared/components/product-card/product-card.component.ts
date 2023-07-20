import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { ProductSubset } from '../../models/product-subset';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input() product!: ProductSubset;
  MRP!: number;
  constructor(private sharedData: SharedDataService) {
    this.MRP = this.sharedData.DEFAULT_MRP;
  }
}
