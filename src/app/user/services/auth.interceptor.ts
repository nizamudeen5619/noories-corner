import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { Router } from '@angular/router';

import { environment } from "src/environments/environment";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sharedData: SharedDataService, private router: Router, private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set the 'apipass' header
    let modifiedRequest = request.clone({
      setHeaders: {
        'apipass': environment.apiPassword
      }
    });

    // Check if the token is available and update the request headers accordingly
    return this.sharedData.getAuthTokenObs().pipe(
      take(1), // Take only the first emission to prevent multiple subscriptions
      switchMap(token => {
        if (token && !this.isUnauthenticatedEndpoint(request.url)) {
          const expdate = this.cookieService.get('tokenExpiration');
          if (expdate) {
            const expirationDate = new Date(expdate);
            const currentDate = new Date();
            if (currentDate < expirationDate) {
              modifiedRequest = modifiedRequest.clone({
                setHeaders: {
                  'Authorization': `Bearer ${token}`
                }
              });
            }
            else {
              this.router.navigate(['login'])
            }
          }
        }
        return next.handle(modifiedRequest);
      })
    );
  }

  isUnauthenticatedEndpoint(url: string): boolean {
    // Define the list of endpoints that do not require authentication
    const unauthenticatedEndpoints = ['users/register', 'users/login'];

    // Check if the URL includes any of the unauthenticated endpoints
    return unauthenticatedEndpoints.some(endpoint => url.includes(endpoint));
  }
}
