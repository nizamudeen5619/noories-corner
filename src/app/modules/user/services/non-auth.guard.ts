import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard {

  constructor(private route$: Router, private userService: UserService) { }

  canActivate: CanActivateFn = () => {
    
    if (this.userService.isLoggedIn()) {
      this.route$.navigate([''])
      return false;
    }
    return true;
  }

}


