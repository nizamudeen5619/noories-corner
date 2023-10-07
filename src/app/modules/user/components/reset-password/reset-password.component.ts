import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  token: string = '';
  isError!: boolean;
  errorStatusCode!: string;
  errorMessage!: string;
  isLoading!: boolean;
  passwordExpiredError = false;
  displayStyle = '';
  resetForm: FormGroup;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator() }); // Add the custom validator to the form group
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    if (!this.token) {
      this.router.navigate(['error/404']);
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      // Check if the password contains at least 8 characters, one uppercase letter,
      // one lowercase letter, one symbol, and one number.
      const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

      return regex.test(value) ? null : { invalidPassword: true };
    };
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
      this.userService.resetPassword(this.token, this.resetForm.get('confirmPassword')?.value)
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
              this.passwordExpiredError = true;
              this.errorMessage = 'Link Expired';
            }
            this.errorStatusCode = error.status;
          }
        });
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
