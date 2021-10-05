import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class ReporteduserService {
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    let token = JSON.parse(localStorage.getItem('_token'))
    headers = headers.set('Authorization', token)
    return headers;
  }
  getlist() {
    return this.http.get(URL + '/admin/list/reportedUsers', { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
}
