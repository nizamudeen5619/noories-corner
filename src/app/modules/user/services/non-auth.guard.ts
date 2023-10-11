import { Injectable } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard {

  constructor(private route$: Router, private state: RouterStateSnapshot) { }

  canActivate: CanActivateFn = () => {
    const url = this.state.url;
    const loginRoute = url.includes('login');
    const signupRoute = url.includes('signup');
    if (!loginRoute && !signupRoute) {
      return true;
    }
    this.route$.navigate([''])
    return false;
  }

}


