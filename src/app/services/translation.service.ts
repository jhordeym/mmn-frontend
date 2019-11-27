import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { environment as ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private http: HttpClient) {}
}
