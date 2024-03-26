import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(paymentData: any): Observable<any> {
    return this.http.post<any>('http://localhost:4500/payment/payment', paymentData);
  }

  getAllPaymentsByOrder(orderID: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4500/payment/${orderID}`);
  }

  updatePayment(paymentId: string, paymentData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:4500/payment/${paymentId}`, paymentData);
  }

  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:4500/payment/${paymentId}`);
  }
}
