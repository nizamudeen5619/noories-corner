import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../shared/models/product';
import { EMPTY, Subscription, catchError, finalize, map, switchMap } from 'rxjs';
import { SharedDataService } from '../shared/services/shared-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading!: boolean;
  isError!: boolean;
  topSelling: Product[] = [];
  topRated: Product[] = [];
  errorStatusCode: any;
  topProductssubscription!: Subscription;
  constructor(private sharedData: SharedDataService) { }
  ngOnInit(): void {
    this.isLoading = true;
    this.isError = false;
    this.topProductssubscription = this.sharedData.getTopProductsAmazon().pipe(
      switchMap((data1) => {
        return this.sharedData.getTopProductsMeesho().pipe(
          map((data2) => {
            this.topSelling = [...data1.topSelling, ...data2.topSelling];
            this.topRated = [...data1.topRated, ...data2.topRated];
          })
        );
      }),
      catchError((error) => {
        console.log(error);
        
        this.errorStatusCode = error.status;
        this.isError = true;
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe()
  }
  ngOnDestroy(): void {
    if (this.topProductssubscription) {
      this.topProductssubscription.unsubscribe()
    }
  }
}
