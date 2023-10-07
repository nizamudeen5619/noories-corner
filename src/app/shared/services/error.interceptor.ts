import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMsg: { status: number, message: string } = {
          status: 0,
          message: ''
        };
        if (error.error instanceof ErrorEvent) {
          errorMsg = {
            status: error.status,
            message: error.error.message
          };
        } else {
          errorMsg = {
            status: error.status ? error.status : 500,
            message: error.message
          };
        }
        return throwError(() => errorMsg);
      })
    )
  }
  
}
