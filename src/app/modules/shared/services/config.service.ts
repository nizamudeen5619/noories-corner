import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  private _apiUrl: string;
  private _apiPassword: string;

  constructor() {
    this._apiUrl = process.env['API_URL'] || '';
    this._apiPassword = process.env['API_PASSWORD'] || '';
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get apiPassword(): string {
    return this._apiPassword;
  }
  
}
