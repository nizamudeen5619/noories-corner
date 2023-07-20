import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { tap, catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';
  isError!: boolean;
  errorStatusCode!: string;
  errorMessage!: string;
  isLoading!: boolean;
  passwordExpiredError=false;
  myDiv = this.elementRef.nativeElement.querySelector('#staticBackdrop');

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
    if (!this.token) {
      this.router.navigate(['error/404']);
    }
  }
  
  resetPassword() {
    if (this.newPassword === this.confirmPassword && this.token) {
      this.userService.resetPassword(this.token, this.confirmPassword)
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
            else if(error.status === 401){
              this.passwordExpiredError=true;
              this.errorMessage="Link Expired";
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
  }

  redirect() {
    this.renderer.setStyle(this.myDiv, 'display', 'none');
    this.router.navigate(['user/login']);
  }

}
