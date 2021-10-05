import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    let token = JSON.parse(localStorage.getItem('_token'))
    headers = headers.set('Authorization', token)
    return headers;
  }

  Approvebusiness(id) {
    return this.http.post(URL + '/business/approval?id='+id, { headers: this.getHeader() })//have to put
      .pipe((res) => {
        return res;
      });
  }

  details(id){
    // detail
    return this.http.get(URL + '/business/detail?id='+id, { headers: this.getHeader() })
    .pipe((res) => {
      return res;
    });
  }
}
