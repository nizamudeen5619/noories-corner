import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, finalize, takeUntil } from 'rxjs';

import { SharedDataService } from '../../../shared/services/shared-data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  private destroy$ = new Subject<void>();

  userForm!: FormGroup;
  user: any
  formName!: string;
  buttonName!: string;
  isLoggedIn = false;
  userSubscription$!: Subscription;
  isLoading!: boolean;
  isError = false;
  errorStatusCode!: number;
  formSubmitted = false;
  errorMessage = '';
  registerUpdateFailure = false;
  formData: any;
  isFocussed = {
    name: false,
    age: false,
    email: false,
    password: false
  }
  showPassword = false;
  emailExistsError = false;
  errorEmail = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private sharedData: SharedDataService
  ) { }
  
  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.isLoading = true;
      this.isLoggedIn = true;
      this.userService.userProfile().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
          }
          this.setupForm()
        },
        error: (error) => {
          this.isError = true;
          this.errorStatusCode = error.status;
        }
      });
    }
  }

  private setupForm() {
    const name = this.isLoggedIn ? this.user.name : "";
    const age = this.isLoggedIn ? this.user.age : "";
    const email = this.isLoggedIn ? this.user.email : "";
    const password = "";

    this.buttonName = this.isLoggedIn ? "Update" : "Register";

    this.userForm = this.formBuilder.group({
      name: [name, Validators.required],
      age: [age, [Validators.required, Validators.min(13)]],
      email: [email, [Validators.required, Validators.email]],
      password: [password, []], // Initialize password field for conditional addition
    });

    if (!this.isLoggedIn) {
      this.userForm.get('password')?.setValidators([
        Validators.required,
        Validators.pattern(
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/
        ),
      ]);
      this.userForm.get('password')?.updateValueAndValidity();
    }

    this.isLoading = false;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;

    if (this.userForm.valid) {
      let user: any = {
        name: this.userForm.get('name')?.value,
        age: this.userForm.get('age')?.value,
        email: this.userForm.get('email')?.value,
      };

      if (!this.isLoggedIn) {
        user['password'] = this.userForm.get('password')?.value;
      }
      
      const userServiceMethod = this.isLoggedIn
        ? this.userService.userUpdate(user)
        : this.userService.userRegister(user);
      
      userServiceMethod
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe({
          next: (res) => {
            if (res) {
              if (this.isLoggedIn) {
                this.sharedData.setUserObs(res.userName);
              }
              else {
                this.sharedData.setUserObs(res.user);
                this.sharedData.setAuthTokenObs(res.token);
              }
              this.router.navigate(['/user/profile']);
            }
          },
          error: (error) => {
            if (error.status === 500) {
              this.isError = true;
              this.router.navigate(['error/' + error.status]);
            } else if (error.status === 501) {
              this.errorMessage = "Email Already Exists";
              this.emailExistsError = true;
              this.errorEmail = user.email;
            }
            this.userForm.patchValue(this.formData);
            this.registerUpdateFailure = true;
          }
        });

    }
    else {
      this.userForm.patchValue(this.formData);
      this.registerUpdateFailure = true;
      this.isLoading = false;
    }
  }

  validateFieldAndRemoveClass(fieldName: string): void {
    const control = this.userForm.get(fieldName);
    if (control && control.invalid) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
    switch (fieldName) {
      case 'name':
        this.isFocussed.name = false;
        break;
      case 'age':
        this.isFocussed.age = false;
        break;
      case 'email':
        this.isFocussed.email = false;
        this.emailExistsError = (this.errorEmail === control?.value);
        break;
      case 'password':
        this.isFocussed.password = false;
        break;
    }
  }

  onCheckboxChange(event: any) {
    this.showPassword = event.target.checked;
  }

  cancelUpdate() {
    this.router.navigate(['profile']);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}