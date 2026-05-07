import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl + 'auth';

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl + '/login'}`, payload);
  }

  signup(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl + '/register'}`, user);
  }



  isLogin: boolean = !!sessionStorage.getItem('token');
  isAdmin: boolean = sessionStorage.getItem('authRole') === 'ROLE_ADMIN';
  updateAuthState(token?: string, role?: string, email?: string) {
    if (token && role && email) {
      // store data
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('authRole', role);
      sessionStorage.setItem('email', email);

      // update booleans
      this.isLogin = true;
      this.isAdmin = role === 'ROLE_ADMIN';
    } else {
      // clear data
      sessionStorage.clear();
      this.isLogin = false;
      this.isAdmin = false;
    }
  }
}
