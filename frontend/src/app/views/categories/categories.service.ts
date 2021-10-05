import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
const URL = environment.API_URL
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private CategoryList = new Subject<any>()
  constructor(private http: HttpClient) { }
  getHeader() {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json')
    let token = JSON.parse(localStorage.getItem('_token'))
    headers = headers.set('Authorization', token)
    return headers;
  }

  setCategory(data: any) {
    this.CategoryList.next({ CategoryList: data });
  }

  getCategory(): Observable<any> {
    return this.CategoryList.asObservable();
  }


  getlist() {
    return this.http.get(URL + '/admin/list/category', { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });
  }
  deletecategory(id) {
    return this.http.delete(URL + '/admin/delete/category?id=' + id, { headers: this.getHeader() })
      .pipe((res) => {

        return res;
      });
  }
  updatecategory(id, data) {
    console.log("in update category")
    return this.http.put(URL + '/admin/update/category?id=' + id, data, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });

  }
  addcategory(data) {
    return this.http.post(URL + '/admin/add/category', data, { headers: this.getHeader() })
      .pipe((res) => {
        return res;
      });

  }
  uploadImage(path) {
    // /user/uploadPhoto
    let formData = {
      img: path
    }
    // return this.http.post(URL + '/user/uploadPhoto', formData)
    //   .pipe((res) => {
    //     return res;
    //   });
    // return this.http.post<any>(URL+ '/user/uploadPhoto', formData, {
    //   reportProgress: true,
    //   observe: 'events'
    // });
    
  }
}
