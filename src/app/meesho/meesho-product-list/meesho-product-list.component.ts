import { Component, OnInit } from '@angular/core';
import { MeeshoService } from '../meesho.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, distinctUntilChanged, switchMap, timeInterval, catchError, EMPTY } from 'rxjs';
import { DesignFilter, ColorFilter } from 'src/app/shared/models/filters';

@Component({
  selector: 'app-meesho-product-list',
  templateUrl: './meesho-product-list.component.html',
  styleUrls: ['./meesho-product-list.component.css']
})
export class MeeshoProductListComponent implements OnInit {
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

  constructor(private meeshoService: MeeshoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorStatusCode = this.meeshoService.DEFAULT_ERROR_STATUS_CODE;
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
        return this.meeshoService.getProducts(page - 1, this.designFilter, this.colorFilter).pipe(
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
