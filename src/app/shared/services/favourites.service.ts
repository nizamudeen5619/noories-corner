import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  baseUrl = "http://localhost:3000/api/v1/users";

  constructor(private http: HttpClient) { }

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
