import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:4500/payment';

  constructor(private http: HttpClient) { }

  createPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/payment`, paymentData);
  }

  getAllPaymentsByOrder(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }

  updatePayment(paymentId: string, paymentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${paymentId}`, paymentData);
  }

  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${paymentId}`);
  }
}
