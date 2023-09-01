import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, catchError, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  userName?: string;
  isLoading!: boolean;
  currentPage = '';
  private destroy$ = new Subject<void>();

  constructor(private sharedData: SharedDataService, private router: Router) {
  }
  ngOnInit(): void {
    const currentRoute = window.location.href;
    if (currentRoute.includes('amazon')) {
      this.currentPage = 'amazon';
    } else if (currentRoute.includes('meesho')) {
      this.currentPage = 'meesho';
    } else if (!currentRoute.includes('error') || !currentRoute.includes('user')) {
      this.currentPage = 'home';
    }
    this.sharedData.getUserObs().pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (username) => {
        if (username) {
          this.isLoggedIn = true;
          this.userName = username;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.router.navigate(['/error', error.status]);
      }
    });
  }
  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
