import { Component } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, catchError, tap, of, Observable, throwError, takeUntil, Subject } from 'rxjs';

import { SharedDataService } from '../../shared/services/shared-data.service';
import { FavouritesService } from '../../shared/services/favourites.service';
import { MeeshoService } from '../meesho.service';

import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-meesho-product-details',
  templateUrl: './meesho-product-details.component.html',
  styleUrls: ['./meesho-product-details.component.css']
})
export class MeeshoProductDetailsComponent {

  private destroy$: Subject<void> = new Subject<void>();

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

  constructor(
    private route$: ActivatedRoute,
    private meeshoService: MeeshoService,
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
      concatMap(({ id }) => {
        this.productID = id;
        return this.meeshoService.getProductDetails(id).pipe(
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
    })
  }

  addRemoveFavourites() {
    if (this.isLoggedIn) {
      if (!this.isFavourite) {
        this.isLoading = true;
        this.favService.favouritesAdd(this.productID).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: ({ addedToFavourites }) => {
            if (addedToFavourites) {
              this.isFavourite = true;
              this.buttonText = "Remove from Favourites";
            }
          },
          error: error => this.handleError(error),
          complete: () => this.isLoading = false
        });
      } else {
        this.isLoading = true;
        this.favService.favouritesDelete(this.productID).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: ({ removedFromFavourites }) => {
            if (removedFromFavourites) {
              this.isFavourite = false;
              this.buttonText = "Add to Favourites";
            }
          },
          error: error => this.handleError(error),
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
