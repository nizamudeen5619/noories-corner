import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject, catchError, finalize, map, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { SharedDataService } from '../shared/services/shared-data.service';

import { Product } from '../shared/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  isLoading!: boolean;
  isError!: boolean;
  topSelling: Product[] = [];
  topRated: Product[] = [];
  errorStatusCode: any;

  constructor(private sharedData: SharedDataService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isError = false;
    this.sharedData.getTopProductsAmazon().pipe(
      takeUntil(this.destroy$),
      switchMap((data1) => {
        return this.sharedData.getTopProductsMeesho().pipe(
          map((data2) => {
            this.topSelling = [...data1.topSelling, ...data2.topSelling];
            this.topRated = [...data1.topRated, ...data2.topRated];
          })
        );
      }),
      catchError((error) => {
        this.isError = true;
        this.router.navigate(['error/' + error.status]);
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}
