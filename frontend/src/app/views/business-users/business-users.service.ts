import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class BusinessUsersService {
  private BusinessList = new Subject<any>()
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    let token = JSON.parse(localStorage.getItem('_token'))
    headers = headers.set('Authorization', token)
    return headers;
  }
  setBusiness(data: any) {
    this.BusinessList.next({ BusinessList: data });
  }

  getBusiness(): Observable<any> {
    return this.BusinessList.asObservable();
  }
  getlist() {
    return this.http.get(URL + '/admin/list/user?filter=business_user', { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
  deleteuser(id) {
    return this.http.delete(URL + '/admin/remove/business?id=' + id, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }


  // business services 
  getbusinesslist() {
    return this.http.get(URL + '/admin/list/business', { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
  businessstatusupdate(id, status) {
    // console.log("BusinessUsersService -> businessstatusupdate -> id,status", id, status)
    return this.http.put(URL + '/admin/businessreq?id=' + id, status, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
  addbusinesses(data) {
    // console.log("BusinessUsersService -> addbusinesses -> data", data)
    let Obj = {
      business: data
    }
    return this.http.post(URL + '/admin/add/business', Obj, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
}
