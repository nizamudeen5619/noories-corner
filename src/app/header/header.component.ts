import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { Router } from '@angular/router';
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
  errorStatusCode: any;
  private destroy$ = new Subject<void>();

  constructor(private sharedData: SharedDataService, private route$: Router) {
  }
  ngOnInit(): void {
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
        this.errorStatusCode = error.status;
        this.route$.navigate(['/error', this.errorStatusCode]);
      }
    });
  }
  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
