import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ConfigService } from '../shared/services/config.service';

import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  private API_BASE_URL = environment.apiUrl + "amazon";
  //  private API_BASE_URL = this.config.apiUrl + "amazon";

  constructor(private http: HttpClient, private config: ConfigService) { }

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
