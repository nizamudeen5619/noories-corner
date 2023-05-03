import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
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
          }
        } else {
          errorMsg = {
            status: error.status ? error.status : 404,
            message: error.message
          }
        }
        switch (error.status) {
          case 400:
            errorMsg.message = "Bad request. Please check your input and try again."
            break;
          case 401:
            errorMsg.message = "Unauthorized. Please login and try again."
            break;
          case 403:
            errorMsg.message = "Forbidden. You don't have permission to access this resource."
            break;
          case 404:
            errorMsg.message = "Resource not found. Please check the URL and try again."
            break;
          case 500:
            errorMsg.message = "Internal server error. Please try again later."
            break;
        }
        return throwError(() => errorMsg);
      })
    )
  }
}
