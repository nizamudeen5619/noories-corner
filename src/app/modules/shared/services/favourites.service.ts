import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private baseUrl = environment.apiUrl + "users";
//  private baseUrl = this.config.apiUrl + "users";

  constructor(private http: HttpClient, private config: ConfigService) { }

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
