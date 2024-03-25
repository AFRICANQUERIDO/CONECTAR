import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit { 
  orderForm!: FormGroup;
  userID: string = '';
  gigID: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private orderService: GigsService,
    private authService: AuthServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      orderDescription: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      quantity: ['', Validators.required],
      totalAmount: ['', Validators.required],
      status: ['pending', Validators.required] // Default status
    });

    this.route.paramMap.subscribe(params => {
      this.gigID = params.get('gigID') || ''; 
      console.log(this.gigID);
    });

    const token = localStorage.getItem('token');
    console.log("Token:", token);

    if (token) {
      this.authService.readToken(token).subscribe(
        response => {
          this.userID = response.info.userID;
        });
    }
  }

  createOrder() {
    if (this.orderForm.valid) {
      const orderData = {
        ...this.orderForm.value,
        userID: this.userID,
        gigID: this.gigID
      };

      this.orderService.createOrder(orderData).subscribe(
        (response) => {
          console.log('Order created successfully:', response);
          // Handle success response
        },
        (error) => {
          console.error('Error creating order:', error);
          // Handle error response
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}