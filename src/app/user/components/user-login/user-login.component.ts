import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  errorMessage = '';
  formSubmitted = false;
  isError!: boolean;

  constructor(
    private userService: UserService,
    private route: Router,
    private sharedData: SharedDataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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

    const userLogin = this.loginForm.value;
    this.userService.userLogin(userLogin)
      .pipe(
        tap((res) => {
          if(res){
          this.loginFailure = false;

          const { token, username } = res;

          this.sharedData.setAuthTokenObs(token);
          this.sharedData.setUserObs(username);

          this.route.navigate(['user/profile']);
          }
        }),
        catchError((error) => {          
          if (error.status === 500) {
            this.isError = true;
          }
          else if(error.status===401){
            this.errorMessage="Invalid Credentials."
          }
          else{
            this.errorMessage = error.message;            
          }
          this.loginFailure = true;
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