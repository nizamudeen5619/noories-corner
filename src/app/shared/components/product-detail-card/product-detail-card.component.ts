import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { SafeHtml } from '@angular/platform-browser';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-product-detail-card',
  templateUrl: './product-detail-card.component.html',
  styleUrls: ['./product-detail-card.component.css']
})
export class ProductDetailCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() isFavourite!: boolean;
  @Input() buttonText!: string;
  @Input() offerPercent!: number;
  @Input() productDescription!: SafeHtml;
  @Input() platform!: string;
  @Output() addRemoveFavEvent = new EventEmitter<null>();
  currentTab: string = 'tab1';
  MRP!: number;
  searchURL!: string;
  logo!: string;
  disableBuyButton = false;
  constructor(private sharedData: SharedDataService) {
    this.MRP = this.sharedData.DEFAULT_MRP;
  }
  ngOnInit(): void {
    console.log(this.isFavourite);
    
    this.logo = (this.platform === "amazon") ? "https://i.imgur.com/BklOZWu.png" : "https://i.imgur.com/zvAZrdM.png";
    this.searchURL = (this.platform === "amazon") ? "https://www.amazon.in/s?k=" + this.product.ProductId : this.product.Link || '';
    if (this.searchURL === '') {
      this.disableBuyButton = true;
    }
  }
  addRemoveFavourites() {
    this.addRemoveFavEvent.emit();
  }
  tabClick(currentTab: string) {
    this.currentTab = currentTab;
  }
}
