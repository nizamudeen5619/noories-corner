import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subject,  catchError, concatMap, of, take, takeUntil, tap, throwError } from 'rxjs';

import { Product } from 'src/app/shared/models/product';

import { AmazonService } from '../amazon.service';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { FavouritesService } from "../../shared/services/favourites.service";

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
  displayStyle = 'none';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route$: ActivatedRoute,
    private amazonService: AmazonService,
    private sharedService: SharedDataService,
    private favService: FavouritesService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isError = false;
    this.route$.params.pipe(
      takeUntil(this.destroy$),
      take(1),
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
        this.sharedService.getAuthTokenObs()
      ),
      tap((token) => {
        this.isLoggedIn = !!token;
      }),
      concatMap(() => {
        if (this.isLoggedIn) {
          return this.favService.favouriteCheck(this.productID).pipe(
            catchError((error) => this.handleError(error)),
          );
        } else {
          return of({ checkFavourite: false });
        }
      })
    ).subscribe({
      next: ({ checkFavourite }) => {
        this.isFavourite = checkFavourite;
        this.buttonText = checkFavourite ? "Remove from Favourites" : "Add to Favourites";
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  addRemoveFavourites() {
    if (this.isLoggedIn) {
      if (!this.isFavourite) {
        this.isLoading = true;
        this.favService.favouritesAdd(this.productID).pipe(
          takeUntil(this.destroy$),
        ).subscribe({
          next: ({ addedToFavourites }) => {
            if (addedToFavourites) {
              this.isFavourite = true;
              this.buttonText = "Remove from Favourites";
            }
          },
          error: (error) => this.handleError(error),
          complete: () => this.isLoading = false
        });
      } else {
        this.isLoading = true;
        this.favService.favouritesDelete(this.productID).pipe(
          takeUntil(this.destroy$),
        ).subscribe({
          next: ({ removedFromFavourites }) => {
            if (removedFromFavourites) {
              this.isFavourite = false;
              this.buttonText = "Add to Favourites";
            }
          },
          error: (error) => this.handleError(error),
          complete: () => this.isLoading = false
        });
      }
    }
    else {
      this.displayStyle = 'block';
    }
  }

  handleError(error: any): Observable<never> {
    this.isError = true;
    this.router.navigate(['error/' + error.status]);
    return throwError(() => error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
