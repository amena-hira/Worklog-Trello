import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiURL = environment.apiUrl + 'users';

  constructor(private http: HttpClient) { }

  addUser(item: User): Observable<User> {
    return this.http.post<User>(this.apiURL, item);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/${id}`);
  }

  getUserByEmail(email:string): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/email/${email}`);
  }

  updateUser(item: User): Observable<User> {
    return this.http.put<User>(`${this.apiURL}/${item.id}`, item);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
