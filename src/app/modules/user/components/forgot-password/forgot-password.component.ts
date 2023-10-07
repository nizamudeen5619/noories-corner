import { Component, OnDestroy } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  email: string = '';
  isLoading!: boolean;
  isError = false;
  errorStatusCode!: number;
  errorMessage!: string;
  emailError = false;
  displayStyle = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  forgotPassword() {
    this.isLoading = true;

    this.userService.forgotPassword(this.email)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res && res.status === 'success') {
            this.displayStyle = 'block';
          }
        },
        error: (error) => {
          if (error.status === 500) {
            this.isError = true;
            this.router.navigate(['error/' + error.status]);
          } else if (error.status === 401) {
            this.errorMessage = 'Email not found';
            this.emailError = true;
          }
          this.errorStatusCode = error.status;
        }
      });
  }

  closeModal() {
    this.displayStyle = "none";
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
