import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { EMPTY, Subject, catchError, finalize, takeUntil, tap } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';
  isError!: boolean;
  errorStatusCode!: string;
  errorMessage!: string;
  isLoading!: boolean;
  passwordExpiredError = false;
  displayStyle = '';
  private destroy$ = new Subject<void>();
  resetForm: FormGroup;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator() }); // Add the custom validator to the form group
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    if (!this.token) {
      this.router.navigate(['error/404']);
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    }
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.userService.resetPassword(this.token, this.confirmPassword)
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
              this.passwordExpiredError = true;
              this.errorMessage = 'Link Expired';
            }
            this.errorStatusCode = error.status;
            return EMPTY; // Rethrow the error to be caught by the component's error handling if necessary.
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    }
  }

  closeModal() {
    this.displayStyle = "none";
    this.router.navigate(['user/login']);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
