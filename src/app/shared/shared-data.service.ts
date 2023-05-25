import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {


  private userName$ = new BehaviorSubject<string | null>('');
  private authToken$ = new BehaviorSubject<string | null>('');
  public readonly DEFAULT_MRP = 1499;

  baseUrl = "http://localhost:3000/api/v1/users";

  constructor(private http: HttpClient) {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (user && token) {
      this.userName$.next(user);
      this.authToken$.next(token);
    }
  }

  getErrorMsg(statusCode: number) {
    let errorHeading = '';
    let errorInfo = '';
    switch (statusCode) {
      case 400:
        errorHeading = "Error: Bad Request";
        errorInfo = "The server could not understand your request due to malformed syntax or invalid data.";
        break;
      case 401:
        errorHeading = "Error: Unauthorized";
        errorInfo = "You are not authorized to access this resource. Please log in or provide valid credentials.";
        break;
      case 403:
        errorHeading = "Error: Forbidden";
        errorInfo = "You do not have permission to access this resource. Please contact the site administrator.";
        break;
      case 404:
        errorHeading = "Error: Page Not Found";
        errorInfo = "The page you are looking for could not be found. Please check the URL and try again.";
        break;
      case 500:
        errorHeading = "Error: Internal Server Error";
        errorInfo = "We're sorry, but there was an internal server error. Please try again later.";
        break;
      case 503:
        errorHeading = "Error: Service Unavailable";
        errorInfo = "The server is temporarily unavailable. Please try again later.";
        break;
      default:
        errorHeading = "Oops! Something went wrong.";
        errorInfo = "We're sorry, but we're having some technical difficulties right now. Please try again later.";
        break;
    }
    return { errorHeading, errorInfo };
  }

  getUserObs(): Observable<string | null> {
    return this.userName$.asObservable();
  }

  setUserObs(user: string | null) {
    sessionStorage.setItem('user', user || '')
    this.userName$.next(user || '');
  }

  getAuthTokenObs(): Observable<string | null> {
    return this.authToken$.asObservable();
  }

  setAuthTokenObs(token: string | null) {
    sessionStorage.setItem('token', token || '')
    this.authToken$.next(token || '');
  }

  removeData() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.userName$.next(null);
    this.authToken$.next(null);
  }

  favouriteCheck(productID: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/favourites/${productID}`);
  }
  favouritesAdd(productID: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/favourites/${productID}`, {});
  }
  favouritesDelete(productID: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/favourites/${productID}`);
  }
  favouritesView(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/favourites`);
  }

}
