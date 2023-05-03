import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmazonService } from '../amazon.service';
import { Product } from "../../shared/models/product";
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, catchError, distinctUntilChanged, map, switchMap, timeInterval } from 'rxjs';

interface DesignFilter {
  Design: string;
}

interface ColorFilter {
  Color: string;
}

@Component({
  selector: 'app-amazon-product-list',
  templateUrl: './amazon-product-list.component.html',
  styleUrls: ['./amazon-product-list.component.css']
})
export class AmazonProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  currentPage!: number;
  pages: { page: number }[] = []
  timetaken!: number;
  isLoading !: boolean;
  offerPercent!: number;
  isError !: boolean;
  MRP!: number;
  errorStatusCode!: number;

  designFilter: DesignFilter[] = []
  colorFilter: ColorFilter[] = []
  queryParamsSubscription!: Subscription;

  constructor(private amazon: AmazonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorStatusCode = this.amazon.DEFAULT_ERROR_STATUS_CODE;
    this.loadProducts()
  }
  applyFilters(filters: { design: DesignFilter[]; color: ColorFilter[]; }) {
    sessionStorage.setItem('filters', JSON.stringify(filters))
    this.designFilter = [...filters.design]
    this.colorFilter = [...filters.color]
    this.loadProducts()
  }
  loadProducts() {
    this.isLoading = true;
    this.isError = false;
    this.queryParamsSubscription = this.route.queryParams.pipe(
      map((params) => parseInt(params['page']) || 1),
      distinctUntilChanged(),
      switchMap((page) => {
        this.currentPage = page
        return this.amazon.getProducts(page - 1, this.designFilter, this.colorFilter).pipe(
          timeInterval(),
          catchError((error) => {
            this.errorStatusCode = error.status;
            this.isError = true;
            return EMPTY;
          })
        )
      })
    ).subscribe((res) => {
      this.isError = false;
      this.products = res.value.products;
      this.pages = res.value.pages;
      this.timetaken = res.interval;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
