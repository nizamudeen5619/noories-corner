import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  userForm!: FormGroup;
  user: any
  formName!: string;
  isLoggedIn = false;
  userSubscription$!: Subscription;
  showSuccessModal: boolean = false;
  showFailureModal: boolean = false;
  isLoading!: boolean;
  isError!: boolean;
  errorStatusCode!: number;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: Router, private sharedData: SharedDataService) { }
  ngOnInit() {
    this.isLoading = true;
    this.userSubscription$ = this.sharedData.getUserObs()
      .pipe(
        catchError((error) => {
          if (error.status === 500) {
            this.isError = true;
          }
          return EMPTY;
        })
      )
      .subscribe((user) => {
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

    this.formName = this.isLoggedIn ? "Update" : "Sign Up";
    this.userForm = this.formBuilder.group({
      name: [name, Validators.required],
      age: [age, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,20}$')]],
    });
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    const user = {
      name: this.userForm.get('name')?.value,
      age: this.userForm.get('age')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value
    };

    if (this.userForm.valid) {
      let userServiceMethod;
      let successMessage;

      if (this.isLoggedIn) {
        userServiceMethod = this.userService.userUpdate(user);
        successMessage = 'Updated Successfully';
      } else {
        userServiceMethod = this.userService.userRegister(user);
        successMessage = 'Registered Successfully';
      }

      userServiceMethod
        .pipe(
          catchError((error) => {
            if (error.status === 500) {
              this.isError = true;
            }
            this.showFailureModal = true;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res) {
            this.showSuccessModal = true;
            this.sharedData.setUserObs(res.user);
            this.sharedData.setAuthTokenObs(res.token);
            this.isLoading = false;
            this.isError = false;
          }
        });
    }
  }
  
  navigateToProfile() {
    this.route.navigate(['profile']);
  }
  navigateToHome() {
    this.route.navigateByUrl('');
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  cancelUpdate() {
    this.route.navigate(['profile']);
  }
}