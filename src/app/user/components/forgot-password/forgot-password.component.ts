import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { EMPTY, Subject, catchError, finalize, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnDestroy {
  email: string = '';
  isLoading!: boolean;
  isError = false;
  errorStatusCode!: number;
  errorMessage!: string;
  emailError = false;
  displayStyle = '';
  private destroy$ = new Subject<void>();


  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  forgotPassword() {
    this.isLoading = true;

    this.userService.forgotPassword(this.email)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res && res.status === 'success') {
            this.displayStyle = 'block';
          }
        }),
        catchError((error) => {
          if (error.status === 500) {
            this.isError = true;
          } else if (error.status === 401) {
            this.errorMessage = 'Email not found';
            this.emailError = true;
          }
          this.errorStatusCode = error.status;
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
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
