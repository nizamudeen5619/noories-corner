import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product';


@Injectable({
  providedIn: 'root'
})
export class MeeshoService {

  baseUrl = "http://localhost:3000/api/v1/meesho"
  constructor(private http: HttpClient) { }

  getProducts():Observable<Product[]>{
    return this.http.get<any>(`${this.baseUrl}`)
  }
}
