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
  topProducAmazontUrl = "http://localhost:3000/api/v1/amazontop";
  topProductMeeshoUrl = "http://localhost:3000/api/v1/meeshotop";

  constructor(private http: HttpClient) {
    this.setUserAndToken()
  }

  setUserAndToken() {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    this.userName$.next(user);
    this.authToken$.next(token);
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

  getTopProductsAmazon(): Observable<any> {
    return this.http.get<any>(`${this.topProducAmazontUrl}`);
  }

  getTopProductsMeesho(): Observable<any> {
    return this.http.get<any>(`${this.topProductMeeshoUrl}`);
  }


}
