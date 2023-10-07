import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, distinctUntilChanged, switchMap, timeInterval, Subject, takeUntil } from 'rxjs';

import { MeeshoService } from '../meesho.service';

import { DesignFilter, ColorFilter } from '../../shared/models/filters';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-meesho-product-list',
  templateUrl: './meesho-product-list.component.html',
  styleUrls: ['./meesho-product-list.component.css']
})
export class MeeshoProductListComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();

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
