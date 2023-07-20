import { Component, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { tap, catchError, EMPTY, finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading!: boolean;
  isError!: boolean;
  errorStatusCode!: number;
  errorMessage!: string;
  emailError = false;
  myDiv = this.elementRef.nativeElement.querySelector('#staticBackdrop');

  constructor(
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) { }
  onSubmit() {
    this.isLoading = true;
    this.userService.forgotPassword(this.email)
      .pipe(
        tap((res) => {
          if (res) {
            if (res.status === 'success') {
              this.renderer.setStyle(this.myDiv, 'display', 'block');
            }
          }
        }),
        catchError((error) => {
          if (error.status === 500) {
            this.isError = true;
          }
          else if (error.status === 401) {
            this.errorMessage = "Email not found";
          }
          this.errorStatusCode = error.status;
          this.errorMessage = error.message;
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  closeModal() {
    this.renderer.setStyle(this.myDiv, 'display', 'none');
    this.router.navigate(['']);
  }
}
