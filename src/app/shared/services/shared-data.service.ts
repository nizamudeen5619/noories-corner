import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private userName$ = new BehaviorSubject<string | null>('');
  private authToken$ = new BehaviorSubject<string | null>('');
  
  public readonly DEFAULT_MRP = 1499;

  private topProducAmazontUrl = environment.apiUrl + "amazontop";
  private topProductMeeshoUrl = environment.apiUrl + "meeshotop";

  // private topProducAmazontUrl = this.config.apiUrl + "amazontop";
  // private topProductMeeshoUrl = this.config.apiUrl + "meeshotop";

  constructor(private http: HttpClient, private config:ConfigService) { }

  setUserAndToken() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
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
      localStorage.setItem('user', user);
    }
    else {
      localStorage.removeItem('user');
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

      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
      this.authToken$.next(token);
    }
  }

  removeData() {
    if (localStorage.getItem('token')) {
      localStorage.clear();
    }
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
