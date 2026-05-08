import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../model/task';
import { Observable, shareReplay, tap } from 'rxjs';
import { UserTask } from '../../model/user-task';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiURL = environment.apiUrl + 'tasks';
  private tasksCache$?: Observable<Task[]>;

  constructor(private http:HttpClient) { }

  clearCache() {
    this.tasksCache$ = undefined;
  }

  createTask(item:Task): Observable<Task>{
    return this.http.post<Task>(this.apiURL, item).pipe(
      tap(() => this.clearCache())
    );
  }

  getAllTasks(): Observable<Task[]> {
    if (!this.tasksCache$) {
      this.tasksCache$ = this.http.get<Task[]>(this.apiURL).pipe(
        shareReplay(1)
      );
    }
    return this.tasksCache$;
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiURL}/${id}`);
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiURL}/project/${projectId}`);
  }

  updateTask(item: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiURL}/${item.id}`, item).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  getUserTaskStats(email: string): Observable<UserTask> {
    return this.http.get<UserTask>(`${this.apiURL}/stats/${email}`);
  }
}
