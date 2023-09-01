import { Component, OnInit } from '@angular/core';
import { MeeshoService } from '../meesho.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map, distinctUntilChanged, switchMap, timeInterval, catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { DesignFilter, ColorFilter } from 'src/app/shared/models/filters';

@Component({
  selector: 'app-meesho-product-list',
  templateUrl: './meesho-product-list.component.html',
  styleUrls: ['./meesho-product-list.component.css']
})
export class MeeshoProductListComponent implements OnInit {
  products: Product[] = [];
  currentPage!: number;
  pages: { page: number }[] = [];
  timetaken!: number;
  isLoading !: boolean;
  offerPercent!: number;
  isError !: boolean;
  MRP!: number;
  designFilter: DesignFilter[] = [];
  colorFilter: ColorFilter[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private meeshoService: MeeshoService, private route$: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  applyFilters(filters: { design: DesignFilter[]; color: ColorFilter[]; }) {
    sessionStorage.setItem('filters', JSON.stringify(filters));
    this.designFilter = [...filters.design];
    this.colorFilter = [...filters.color];
    this.loadProducts();
  }
  loadProducts() {
    this.isLoading = true;
    this.isError = false;
    this.route$.queryParams.pipe(
      takeUntil(this.destroy$),
      map((params) => parseInt(params['page']) || 1),
      distinctUntilChanged(),
      switchMap((page) => {
        this.currentPage = page
        return this.meeshoService.getProducts(page - 1, this.designFilter, this.colorFilter).pipe(
          timeInterval())
      })
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.products = res.value.products;
        this.pages = res.value.pages;
        this.timetaken = res.interval;
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        this.router.navigate(['error/' + error.status]);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
