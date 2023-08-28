import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {


  private userName$ = new BehaviorSubject<string | null>('');
  private authToken$ = new BehaviorSubject<string | null>('');
  public readonly DEFAULT_MRP = 1499;

  baseUrl = "http://localhost:3000/api/v1/users";
  topProducAmazontUrl = "http://localhost:3000/api/v1/amazontop";
  topProductMeeshoUrl = "http://localhost:3000/api/v1/meeshotop";

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.setUserAndToken()
  }

  setUserAndToken() {
    const user = this.cookieService.get('user');
    const token = this.cookieService.get('token');
    if (user && token) {
      this.userName$.next(user);
      this.authToken$.next(token);
    }
  }

  getUserObs(): Observable<string | null> {
    this.setUserAndToken()
    return this.userName$.asObservable();
  }

  setUserObs(user: string | null) {
    if (user) {
      this.cookieService.set('user', user);
    } else {
      this.cookieService.delete('user');
    }
    this.userName$.next(user || '');
  }

  getAuthTokenObs(): Observable<string | null> {
    this.setUserAndToken()
    return this.authToken$.asObservable();
  }

  setAuthTokenObs(token: string) {
    const decodedToken = jwt_decode<JwtPayload>(token);
    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(decodedToken.exp * 1000); // Convert the expiration timestamp to milliseconds.

      this.cookieService.set('token', token);
      this.cookieService.set('tokenExpiration', expirationDate.toISOString());
      this.authToken$.next(token);
    }
  }

  removeData() {
    this.cookieService.delete('user');
    this.cookieService.delete('token');
    this.userName$.next(null);
    this.authToken$.next(null);
  }

  getTopProductsAmazon(): Observable<any> {
    return this.http.get<any>(`${this.topProducAmazontUrl}`);
  }

  getTopProductsMeesho(): Observable<any> {
    return this.http.get<any>(`${this.topProductMeeshoUrl}`);
  }

}
