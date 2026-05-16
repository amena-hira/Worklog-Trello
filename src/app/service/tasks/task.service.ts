import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../model/task';
import { Observable, shareReplay, tap, BehaviorSubject, switchMap } from 'rxjs';
import { UserTask } from '../../model/user-task';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiURL = environment.apiUrl + 'tasks';
  private reload$ = new BehaviorSubject<void>(undefined);
  private tasksCache$: Observable<Task[]> = this.reload$.pipe(
    switchMap(() => this.http.get<Task[]>(`${this.apiURL}/my-tasks`)),
    shareReplay(1)
  );

  constructor(private http:HttpClient) { }

  clearCache() {
    this.reload$.next();
  }

  createTask(item:Task): Observable<Task>{
    return this.http.post<Task>(this.apiURL, item).pipe(
      tap(() => this.clearCache())
    );
  }

  getAllTasks(): Observable<Task[]> {
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

  getUserTaskStats(): Observable<UserTask> {
    return this.http.get<UserTask>(`${this.apiURL}/stats`);
  }
}
