import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';
import { SharedDataService } from '../../../shared/services/shared-data.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  private destroy$ = new Subject<void>();

  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorStatusCode: any;
  loginSuccess: boolean = false;
  loginFailure: boolean = false;
  errorMessage = '';
  formSubmitted = false;
  isError!: boolean;
  isFocussed = {
    email: false,
    password: false
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private sharedData: SharedDataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const email = localStorage.getItem('NC_Email') || '';
    this.loginForm = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.isLoading = true;
    this.loginFailure = false;

    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }
    const { email, password, rememberMe } = this.loginForm.value;
    this.userService.userLogin({ email, password })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            if (rememberMe) {
              localStorage.setItem('NC_Email', email)
            }
            this.loginFailure = false;

            const { token, username } = res;

            this.sharedData.setAuthTokenObs(token);
            this.sharedData.setUserObs(username);

            this.router.navigate(['']);
          }
        },
        error: (error) => {
          if (error.status === 500) {
            this.isError = true;
            this.router.navigate(['error/' + error.status]);
          }
          else if (error.status === 401) {
            this.errorMessage = "Invalid Credentials."
            this.loginFailure = true;
          }
          this.errorStatusCode = error.status;
        }
      });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

}
