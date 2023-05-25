import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: Router, private sharedData: SharedDataService) { }
  ngOnInit() {
    this.userSubscription$ = this.sharedData.getUserObs().subscribe((user) => {
      this.isLoggedIn = user ? true : false;
      this.user = user;
    });
    if (this.isLoggedIn) {
      this.formName = "Update";
      this.userForm = this.formBuilder.group({
        name: [this.user.name, Validators.required],
        age: [this.user.age, Validators.required],
        email: [this.user.email, [Validators.required, , Validators.email]],
        password: [this.user.password, [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,20}$')]],
      });
    }
    else {
      this.formName = "Sign Up";
      this.userForm = this.formBuilder.group({
        name: ["", Validators.required],
        age: ["", Validators.required],
        email: ["", [Validators.required, , Validators.email]],
        password: ["", [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,20}$')]],
      });
    }
  }
  onSubmit() {
    const user = {
      name: this.userForm.get('name')?.value,
      age: this.userForm.get('age')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value
    };
    if (this.userForm.valid) {
      if (this.isLoggedIn) {
        this.userService.userUpdate(user).subscribe((res) => {
          alert('Updataed Successfully');
          this.sharedData.setUserObs(res.user);
          this.route.navigate(['profile']);
        });
      }
      else {
        this.userService.userRegister(user).subscribe((res) => {
          alert('Registered Successfully');
          this.sharedData.setUserObs(res.user);
          this.sharedData.setAuthTokenObs(res.token);
          this.route.navigate(['profile']);
        });
      }
    }
  }

  cancelUpdate() {
    this.route.navigate(['profile']);
  }
}