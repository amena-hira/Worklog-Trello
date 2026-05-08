import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Project } from '../../model/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + 'projects';
  private projectsCache$?: Observable<Project[]>;

  constructor(private http: HttpClient) { }

  clearCache() {
    this.projectsCache$ = undefined;
  }

  getAllProjects(): Observable<Project[]> {
    if (!this.projectsCache$) {
      this.projectsCache$ = this.http.get<Project[]>(this.apiUrl).pipe(
        shareReplay(1)
      );
    }
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
