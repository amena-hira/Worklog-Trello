import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap, BehaviorSubject, switchMap } from 'rxjs';
import { Project } from '../../model/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + 'projects';
  private reload$ = new BehaviorSubject<void>(undefined);
  
  private projectsCache$: Observable<Project[]> = this.reload$.pipe(
    switchMap(() => {
      const role = sessionStorage.getItem('authRole');
      const isAdmin = role === 'admin' || role === 'ADMIN' || role === 'ROLE_ADMIN';
      const endpoint = isAdmin ? this.apiUrl : `${this.apiUrl}/my-projects`;
      return this.http.get<Project[]>(endpoint);
    }),
    shareReplay(1)
  );

  constructor(private http: HttpClient) { }

  clearCache() {
    this.reload$.next();
  }

  getAllProjects(): Observable<Project[]> {
    return this.projectsCache$;
  }

  getRecentProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/recent`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project).pipe(
      tap(() => this.clearCache())
    );
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${project.id}`, project).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }
}
