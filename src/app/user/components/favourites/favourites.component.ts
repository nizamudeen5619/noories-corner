import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, timeInterval } from 'rxjs';

import { ProductSubset } from '../../../shared/models/product-subset';
import { FavouritesService } from '../../../shared/services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent {

  private destroy$: Subject<void> = new Subject<void>();

  favouriteProducts: ProductSubset[] = [];
  currentPage!: number;
  pages: { page: number }[] = []
  timetaken!: number;
  isLoading !: boolean;
  offerPercent!: number;
  isError !: boolean;
  MRP!: number;
  errorStatusCode!: number;

  constructor(private favourite: FavouritesService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.isError = false;
    this.favourite.favouritesView().pipe(
      takeUntil(this.destroy$),
      timeInterval()
    ).subscribe({
      next: (res) => {
        this.favouriteProducts = res.value.favouriteProducts;
        this.timetaken = res.interval;
        this.isLoading = false;
      },
      error: (error) => {
        this.isError = true;
        this.router.navigate(['error/' + error.status]);
      },
      complete: () => this.isLoading = false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
