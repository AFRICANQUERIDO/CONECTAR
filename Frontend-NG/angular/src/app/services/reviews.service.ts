import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../intefaces/review.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http:HttpClient) { }

  createReview(reviewData: Review): Observable<string> {
    return this.http.post<any>(`http://localhost:4500/reviews`, reviewData);
  }
}
