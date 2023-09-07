import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private userService: UserService, private route$: Router) { }
  canActivate: CanActivateFn = () => {
    if (this.userService.isLoggedIn()) {
      return true;      
    }    
    this.route$.navigate(['user/login'])
    return false;
  }
}


