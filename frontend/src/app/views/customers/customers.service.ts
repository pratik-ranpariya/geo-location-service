import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private CustomersList = new Subject<any>()
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    let token = JSON.parse(localStorage.getItem('_token'))
    headers = headers.set('Authorization', token)
    return headers;
  }

  setCustomers(data: any) {
    this.CustomersList.next({ CustomersList: data });
  }

  getCustomers(): Observable<any> {
    return this.CustomersList.asObservable();
  }


  getlist() {
    return this.http.get(URL + '/admin/list/user?filter=customer', { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
  deleteuser(id) {
    return this.http.delete(URL + '/admin/remove/user?id=' + id, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
}
