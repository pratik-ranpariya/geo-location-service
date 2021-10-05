import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor(private http: HttpClient) { } 
    
  getHeaderWithToken() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    return headers;
  }

  post(obj:any) {
    return this.http.post(URL+'/customer/forgotPassword', obj, { headers: this.getHeaderWithToken() })
  }
}
