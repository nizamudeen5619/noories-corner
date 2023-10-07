import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { SharedDataService } from '../../modules/shared/services/shared-data.service';
import { UserService } from '../../modules/user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  isLoggedIn!: boolean;
  userName?: string;
  currentPage = '';
  errorStatusCode!: number;

  constructor(private sharedData: SharedDataService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const currentRoute = window.location.href;
    if (currentRoute.includes('amazon')) {
      this.currentPage = 'amazon';
    } else if (currentRoute.includes('meesho')) {
      this.currentPage = 'meesho';
    } else if (!currentRoute.includes('error') || !currentRoute.includes('user')) {
      this.currentPage = 'home';
    }
    this.getUserName()
  }

  logout() {
    this.userService.userLogout()
      .subscribe({
        next: () => {
          this.sharedData.removeData();
          this.router.navigateByUrl('');
          this.getUserName()
        },
        error: (error) => {
          this.errorStatusCode = error.status;
          this.router.navigate(['/error', this.errorStatusCode]);
        }
      });
  }

  getUserName() {
    this.sharedData.getUserObs()
      .subscribe((userName) => {
        if (userName) {
          this.userName = userName;
          this.isLoggedIn = true;
        }
        else {
          this.isLoggedIn = false;
        }
      })
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
