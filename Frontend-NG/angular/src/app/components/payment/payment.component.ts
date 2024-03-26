import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      orderId: ['', Validators.required],
      amount: ['', Validators.required],
      source: ['', Validators.required],
      description: ['']
    });
  }

  submitPayment(): void {
    if (this.reviewForm.valid) {
      const paymentData = this.reviewForm.value;
      this.paymentService.createPayment(paymentData).subscribe(
        response => {
          console.log('Payment created successfully:', response);
        },
        error => {
          console.error('Error creating payment:', error);
          }
      );
    } else {
    }
  }

}

