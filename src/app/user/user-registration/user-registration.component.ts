import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UserService } from '../services/user.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

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
  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: Router, private sharedData: SharedDataService, private modalService: NgbModal) { }
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

    this.formName = this.isLoggedIn ? "Stay Connected and Up-to-Date: Update Your Account Now!" : "Unlock a World of Possibilities: Create Your Account Today!";
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
      let successMessage = '';

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
            else {
              this.userForm.patchValue(this.formData);
              this.registerUpdateFailure = true;
            }
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res) {
            this.sharedData.setUserObs(res.user);
            this.sharedData.setAuthTokenObs(res.token);
          }
          this.isLoading = false;
        });
    }
    else {
      this.userForm.patchValue(this.formData);
      this.registerUpdateFailure = true;
      this.isLoading = false;
    }
  }

  openModal(message: string) {
    const modalRef = this.modalService.open(ModalComponent, { windowClass: 'dark-modal', centered: true });
    modalRef.componentInstance.process = this.isLoggedIn ? 'profile' : 'home';
    modalRef.componentInstance.message = message; // Pass message to modal component
  }

  validateField(fieldName: string): void {
    const control = this.userForm.get(fieldName);
    if (control && control.invalid) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  navigateToProfile() {
    this.route.navigate(['profile']);
  }
  navigateToHome() {
    this.route.navigateByUrl('');
  }

  cancelUpdate() {
    this.route.navigate(['profile']);
  }
}