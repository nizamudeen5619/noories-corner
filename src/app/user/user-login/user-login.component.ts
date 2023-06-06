import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError = false;

  constructor(
    private userService: UserService,
    private route: Router,
    private sharedData: SharedDataService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const userLogin = this.loginForm.value;
    this.userService.userLogin(userLogin).subscribe(
      (res) => {
        const { token, username } = res;
        this.sharedData.setAuthTokenObs(token);
        this.sharedData.setUserObs(username);
        this.route.navigate(['user/profile']);
      },
      (error) => {
        console.error('User login error:', error);
        this.loginError = true; // Set a flag to display login error message to the user
      }
    );
  }
}
