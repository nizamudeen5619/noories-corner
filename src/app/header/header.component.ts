import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { UserService } from '../user/services/user.service';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError, of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  userName?: string;
  sharedDataSub!: Subscription;
  userSub!: Subscription;
  isLoading!: boolean;
  errorStatusCode: any;

  constructor(private sharedData: SharedDataService, private userService: UserService, private route$: Router) {
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.sharedDataSub = this.sharedData.getUserObs().pipe(
      catchError((error) => {
        this.errorStatusCode = error.status;
        this.route$.navigate(['/error', this.errorStatusCode]);
        return EMPTY;
      })
    ).subscribe((username) => {
      if (username) {
        this.isLoggedIn = true;
        this.userName = username;
        this.isLoading = false;
      }
    });
  }
  logout() {
    this.isLoading = true;
    this.userSub = this.userService.userLogout().pipe(
      catchError((error) => {
        this.errorStatusCode = error.status;
        this.route$.navigate(['/error', this.errorStatusCode]);
        return EMPTY;
      })
    ).subscribe(() => {
      this.sharedData.removeData();
      this.route$.navigateByUrl('');
      this.isLoggedIn = false;
      this.isLoading = false;
    });
  }
  ngOnDestroy(): void {
    if (this.sharedDataSub.closed) {
      this.sharedDataSub.unsubscribe()
    }
    if (this.userSub.closed) {
      this.userSub.unsubscribe()
    }
  }
}
