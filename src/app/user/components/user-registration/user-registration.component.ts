import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError, finalize, tap } from 'rxjs';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { UserService } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

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
    private route: Router,
    private sharedData: SharedDataService,
    private cdRef: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.isLoading = true;
    this.userSubscription$ = this.sharedData.getUserObs().subscribe((user) => {
      this.isLoggedIn = !!user;
      this.user = user;
      this.isError = false;
      this.setupForm();
    });
  }

  private setupForm() {
    const name = this.isLoggedIn ? this.user.name : "";
    const age = this.isLoggedIn ? this.user.age : "";
    const email = this.isLoggedIn ? this.user.email : "";
    const password = this.isLoggedIn ? this.user.password : "";

    this.formName = this.isLoggedIn ? "Update Your Account Now!" : "Create Your Account Today!";
    this.buttonName = this.isLoggedIn ? "Update" : "Register";
    this.userForm = this.formBuilder.group({
      name: [name, Validators.required],
      age: [age, [Validators.required, Validators.min(13)]],
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/)]],
    });
    this.isLoading = false;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    const user = {
      name: this.userForm.get('name')?.value,
      age: this.userForm.get('age')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value
    };

    this.formData = this.userForm.value;
    if (this.userForm.valid) {
      let userServiceMethod;
      if (this.isLoggedIn) {
        userServiceMethod = this.userService.userUpdate(user);
      } else {
        userServiceMethod = this.userService.userRegister(user);
      }

      userServiceMethod
        .pipe(
          catchError((error) => {
            if (error.status === 500) {
              this.isError = true;
            } else if (error.status === 501) {
              this.errorMessage = "Email Already Exists";
              this.emailExistsError = true;
              this.errorEmail = user.email;
            } else {
              this.errorMessage = error.message;
            }
            this.userForm.patchValue(this.formData);
            this.registerUpdateFailure = true;
            return EMPTY;
          }),
          tap((res) => {
            if (res) {
              this.sharedData.setUserObs(res.user);
              this.sharedData.setAuthTokenObs(res.token);
              this.route.navigate(['/profile']);
            }
          }),
          finalize(() => {
            this.isLoading = false;
          })
        ).subscribe();

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
        this.emailExistsError = (this.errorEmail === control?.value)
        console.log(this.emailExistsError);

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
    this.route.navigate(['profile']);
  }
}