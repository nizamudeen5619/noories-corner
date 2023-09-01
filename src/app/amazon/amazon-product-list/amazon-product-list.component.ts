import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmazonService } from '../amazon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, switchMap, takeUntil, timeInterval } from 'rxjs';
import { ProductSubset } from 'src/app/shared/models/product-subset';
import { ColorFilter, DesignFilter } from 'src/app/shared/models/filters';

@Component({
  selector: 'app-amazon-product-list',
  templateUrl: './amazon-product-list.component.html',
  styleUrls: ['./amazon-product-list.component.css']
})
export class AmazonProductListComponent implements OnInit, OnDestroy {
  products: ProductSubset[] = [];
  currentPage!: number;
  pages: { page: number }[] = []
  timetaken!: number;
  isLoading !: boolean;
  offerPercent!: number;
  isError !: boolean;
  MRP!: number;

  designFilter: DesignFilter[] = []
  colorFilter: ColorFilter[] = []

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private amazonService: AmazonService, private route$: ActivatedRoute, private router: Router) { }

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
      switchMap((page) => {
        this.currentPage = page
        return this.amazonService.getProducts(page - 1, this.designFilter, this.colorFilter).pipe(
          timeInterval()
        )
      })
    ).subscribe({
      next: (res) => {
        this.products = res.value.products;
        this.pages = res.value.pages;
        this.timetaken = res.interval;
        this.isLoading = false;
      },
      error: (error) => {
        this.isError = true;
        this.isLoading = false;
        this.router.navigate(['error/' + error.status]);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
