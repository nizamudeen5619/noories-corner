import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { SafeHtml } from '@angular/platform-browser';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-product-detail-card',
  templateUrl: './product-detail-card.component.html',
  styleUrls: ['./product-detail-card.component.css']
})
export class ProductDetailCardComponent {
  @Input() product!: Product;
  @Input() isFavourite!: boolean;
  @Input() buttonText!: string;
  @Input() offerPercent!: number;
  @Input() productDescription!: SafeHtml;
  @Input() searchURL!: string;
  @Output() addRemoveFavEvent = new EventEmitter<null>();
  currentTab: string = 'tab1';
  MRP!: number;

  constructor(private sharedData: SharedDataService) {
    this.MRP = this.sharedData.DEFAULT_MRP;
  }
  addRemoveFavourites() {
    this.addRemoveFavEvent.emit();
  }
  tabClick(currentTab: string) {
    this.currentTab = currentTab;
  }
}
