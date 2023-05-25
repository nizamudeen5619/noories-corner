import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/app/shared/shared-data.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = "http://localhost:3000/api/v1/users";

  constructor(private http: HttpClient, private sharedData: SharedDataService) { }

  userRegister(user: { name: string; age: number; email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }
  userLogin(userLogin: { email: string; password: string; }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, userLogin);
  }
  userLogout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, undefined);
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
  userDelete(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/me`);
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
    const isLoggedIn = this.sharedData.getAuthTokenObs().subscribe((token) => {
      return token ? true : false;
    })
    return isLoggedIn;
  }
}
