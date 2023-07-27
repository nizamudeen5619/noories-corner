import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';

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

  constructor(private http: HttpClient) {
    this.setUserAndToken()
  }

  setUserAndToken() {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
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
    sessionStorage.setItem('user', user || '')
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

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiration', expirationDate.toISOString());
      this.authToken$.next(token);
    }
  }

  removeData() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
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
