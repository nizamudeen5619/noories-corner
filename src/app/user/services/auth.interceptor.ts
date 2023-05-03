import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sharedData: SharedDataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({ headers: request.headers.set('apipass', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlwYXNzIjoiQmVyc2Vya2VyQDU2MTkiLCJpYXQiOjE2Nzk1NTg5NDZ9.SIBzq80blOIwyNuXkfBrxB9clVaDYCI3AbWmUxRG-sU') });
    this.sharedData.getAuthTokenObs().subscribe((token) => {
      if (token && !request.url.includes('users/register') || !request.url.includes('users/login')) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
      }
    });
    return next.handle(request);
  }
}
