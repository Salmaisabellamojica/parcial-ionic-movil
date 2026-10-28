import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

interface CommentResponse {
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  referenceComment: string;
  grade: number;
  observation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/comments';

  getStudents(): Observable<Student[]> {
    return this.http.get<CommentResponse[]>(this.apiUrl).pipe(
      map((comments) =>
        comments.map((comment) => ({
          id: comment.id,
          name: comment.name,
          email: comment.email,
          referenceComment: comment.body,
          grade: Number((1 + ((comment.id - 1) % 41) / 10).toFixed(1)),
          observation: '',
        })),
      ),
    );
  }
}