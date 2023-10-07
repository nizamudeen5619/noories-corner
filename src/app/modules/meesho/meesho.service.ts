import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../shared/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeeshoService {

  private API_BASE_URL = environment.apiUrl + "meesho";

  constructor(private http: HttpClient) { }

  getProducts(page: number, designFilterArray: { Design: string }[], colorFilterArray: { Color: string }[]): Observable<any> {
    let queryParams = new HttpParams().append("page", page);
    const designFilter = JSON.stringify(designFilterArray);
    const colorFilter = JSON.stringify(colorFilterArray);
    queryParams = queryParams.append('design', designFilter);
    queryParams = queryParams.append('color', colorFilter);
    return this.http.get<Product[]>(`${this.API_BASE_URL}`, { params: queryParams });
  }

  getProductDetails(id: string) {
    return this.http.get<Product>(`${this.API_BASE_URL}/${id}`);
  }

}
