import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// const URL="http://2001:1600:3:13:f816:3eff:fe02:fc3f:4201"
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  getHeaderWithToken() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    // Access-Control-Allow-Origin: *

    return headers;
  }

  post(obj: any) {
    return this.http.post(URL + '/user/login', obj, { headers: this.getHeaderWithToken() })
  }
}
