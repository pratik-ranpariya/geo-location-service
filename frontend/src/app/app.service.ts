import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private SitesList = new Subject<any>()
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    // let token = JSON.parse(localStorage.getItem('_token'))
    // headers = headers.set('Authorization', token)
    return headers;
  }
}
