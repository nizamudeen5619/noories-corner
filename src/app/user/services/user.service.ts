import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl + "users";

  constructor(private http: HttpClient, private sharedData: SharedDataService) { }

  userRegister(user: { name: string; age: number; email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }
  userLogin(userLogin: { email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, userLogin);
  }
  userLogout(): Observable<any> {
    if (this.isLoggedIn()) {
      return this.http.post<any>(`${this.baseUrl}/logout`, undefined);
    }
    else {
      return EMPTY;
    }
  }
  userLogoutAll(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logoutAll`, undefined);
  }
  userProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }
  userUpdate(updateUser: { name: string; age: number; email: string; password: string; }): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/me`, updateUser);
  }
  userDelete(password: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/me`, { body: { password } });
  }
  avatarUpload(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/me/avatar`, formData);
  }
  avatarDelete(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/me/avatar`);
  }
  avatarView(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me/avatar`, { observe: 'response', responseType: 'blob' as 'json' });
  }
  isLoggedIn() {
    let isLoggedIn = false;
    this.sharedData.getAuthTokenObs().subscribe((token) => {
      isLoggedIn = !!token;
    })
    return isLoggedIn;
  }
  forgotPassword(email: string) {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }
  resetPassword(token: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, { token, password });
  }
}
