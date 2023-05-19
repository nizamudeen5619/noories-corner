import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  public readonly API_BASE_URL = "http://localhost:3000/api/v1/amazon"
  public readonly AMAZON_SEARCH_URL="https://www.amazon.in/s?k="
  public readonly DEFAULT_ERROR_STATUS_CODE = 500

  constructor(private http: HttpClient) { }


  getProducts(page: number, designFilterArray: { Design: string }[], colorFilterArray: { Color: string }[]): Observable<any> {
    let queryParams = new HttpParams().append("page", page);
    const designFilter = JSON.stringify(designFilterArray)
    const colorFilter = JSON.stringify(colorFilterArray)
    queryParams = queryParams.append('design', designFilter)
    queryParams = queryParams.append('color', colorFilter)
    return this.http.get<Product[]>(`${this.API_BASE_URL}`, { params: queryParams })
  }
  getProductDetails(id: string) {
    return this.http.get<Product>(`${this.API_BASE_URL}/${id}`)
  }
}
