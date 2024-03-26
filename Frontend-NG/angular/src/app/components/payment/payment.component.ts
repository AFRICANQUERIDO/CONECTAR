import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order, orderResponse } from '../../intefaces/gig.interface';
import { GigsService } from '../../services/gigs.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
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

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      this.paymentService.createPayment(paymentData).subscribe(
        response => {
          this.success = true;
          this.message = 'Payment created successfully';
          console.log('Payment created successfully:', response);
        },
        error => {
          this.success = false;
          this.message = 'Error creating payment: ' + error.message;
          console.error('Error creating payment:', error);
        }
      );
    } else {
      
    }
  }
}