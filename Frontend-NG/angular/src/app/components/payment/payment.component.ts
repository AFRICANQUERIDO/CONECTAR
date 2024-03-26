import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order, orderResponse } from '../../intefaces/gig.interface';
import { GigsService } from '../../services/gigs.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  paymentForm!: FormGroup;
  orderID!: string;
  order: orderResponse[] = [];
  totalAmount!: number;
  message: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private orderService: GigsService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderID = params['orderID'];
      
      localStorage.setItem('orderID', this.orderID);
  
      this.orderService.getOrders(this.orderID).subscribe((res: { order: Order[] }) => {
        this.totalAmount = res.order[0].totalAmount;
  
        this.paymentForm = this.fb.group({
          orderID: [this.orderID, Validators.required],
          amount: [this.totalAmount, Validators.required],
          source: ['', Validators.required],
          description: ['']
        });
      });
    });
  }

  // orderID: [{ value: this.orderID, disabled: true }, Validators.required],
  // totalAmount: [{ value: this.totalAmount, disabled: true }, Validators.required],

  submitPayment() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      this.paymentService.createPayment(paymentData).subscribe(
        response => {
          this.success = true;
          this.message = 'Payment successful';
          console.log('Payment successful:', response);
          this.paymentForm.reset
        },
        error => {
          this.success = false;
          this.message = 'Error creating payment: Please try again';
          console.error('Error creating payment:', error);
        }
      )
    } else {
      this.success = false;
      this.message = ' Please fill in all required fields';
    }
  }
}  