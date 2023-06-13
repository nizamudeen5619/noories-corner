import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorStatusCode: any;
  loginSuccess: boolean = false;
  loginFailure: boolean = false;

  constructor(
    private userService: UserService,
    private route: Router,
    private sharedData: SharedDataService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.loginFailure = false; 

    if (this.loginForm.invalid) {
      this.loginFailure = true;
      this.isLoading = false; 
      return;
    }

    const userLogin = this.loginForm.value;
    this.userService.userLogin(userLogin)
      .pipe(
        tap((res) => {
          this.loginSuccess = true;
          this.loginForm.reset();

          const { token, username } = res;

          this.sharedData.setAuthTokenObs(token);
          this.sharedData.setUserObs(username);

          this.route.navigate(['user/profile']);
        }),
        catchError((error) => {
          this.loginSuccess = false;
          this.errorStatusCode = error.status;
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}
