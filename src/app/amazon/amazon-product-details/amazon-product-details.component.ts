import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription, catchError, concatMap, finalize, of, tap, throwError } from 'rxjs';

import { AmazonService } from '../amazon.service';
import { Product } from 'src/app/shared/models/product';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-amazon-product-details',
  templateUrl: './amazon-product-details.component.html',
  styleUrls: ['./amazon-product-details.component.css']
})
export class AmazonProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;
  isLoggedIn!: boolean;
  isFavourite !: boolean;
  buttonText!: string;
  productID!: string;
  productDescription!: SafeHtml;
  offerPercent!: number;
  timetaken!: number;
  isLoading !: boolean;
  isError !: boolean;
  errorStatusCode = 0;
  routeSubscription!: Subscription;
  sharedServiceSubscription!: Subscription;
  @ViewChild('loginMessageModalButton') loginMessageModalButton !: ElementRef;

  constructor(private route$: ActivatedRoute, private amazonService: AmazonService, private sharedService: SharedDataService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isError = false;
    this.routeSubscription = this.route$.params.pipe(
      concatMap(({ id }) => {
        this.productID = id;
        return this.amazonService.getProductDetails(id).pipe(
          catchError((error) => this.handleError(error)),
        );
      }),
      tap((product: Product) => {
        this.product = product;
        this.productDescription = this.sanitizer.bypassSecurityTrustHtml(
          this.product.ProductDescription
        );
        this.offerPercent = Math.ceil((this.product.Price / this.sharedService.DEFAULT_MRP) * 100);
      }),
      concatMap(() =>
        this.sharedService.getAuthTokenObs().pipe(
          catchError((error) => this.handleError(error)),
        )
      ),
      tap((token) => {
        this.isLoggedIn = !!token;
      }),
      concatMap(() => {
        if (this.isLoggedIn) {
          return this.sharedService.favouriteCheck(this.productID).pipe(
            catchError((error) => this.handleError(error)),
          );
        } else {
          return of({ checkFavourite: false });
        }
      }),
      tap(({ checkFavourite }) => {
        this.isFavourite = checkFavourite;
        this.buttonText = checkFavourite ? "Remove from Favourites" : "Add to Favourites";
      })
    ).subscribe(() => {
      this.isLoading = false;
    }
    );
  }

  addRemoveFavourites() {
    if (this.isLoggedIn) {
      if (!this.isFavourite) {
        this.isLoading = true;
        this.sharedServiceSubscription = this.sharedService.favouritesAdd(this.productID).pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.isLoading = false),
          tap(({ addedToFavourites }) => {
            if (addedToFavourites) {
              this.isFavourite = true;
              this.buttonText = "Remove from Favourites";
            }
          })
        ).subscribe();
      } else {
        this.isLoading = true;
        this.sharedServiceSubscription = this.sharedService.favouritesDelete(this.productID).pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.isLoading = false),
          tap(({ removedFromFavourites }) => {
            if (removedFromFavourites) {
              this.isFavourite = false;
              this.buttonText = "Add to Favourites";
            }
          })
        ).subscribe();
      }
    }
    else {
      this.loginMessageModalButton.nativeElement.click();
    }
  }
  handleError(error: any): Observable<never> {
    this.isError = true;
    this.errorStatusCode = error.status;
    this.isLoading = false;
    return throwError(() => error);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
