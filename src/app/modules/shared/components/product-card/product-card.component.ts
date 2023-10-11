import { Component, Input, OnInit } from '@angular/core';

import { SharedDataService } from '../../services/shared-data.service';

import { ProductSubset } from '../../models/product-subset';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductSubset;

  MRP!: number;
  detailLink !: string;

  constructor(private sharedData: SharedDataService) {
    this.MRP = this.sharedData.DEFAULT_MRP;
  }

  ngOnInit(): void {
    switch (this.product?.Platform) {
      case "meesho":
        this.detailLink = "../../meesho/product/";
        break;
      case "amazon":
        this.detailLink = "../../amazon/product/";
        break;
      default:
        this.detailLink = '../product/'
    }
  }
}
