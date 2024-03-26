import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
    private route: ActivatedRoute,
    private router:Router
  ) { }

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
          Swal.fire({
            title: 'ORDERS',
            text: response.message,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#21cdc0',
            cancelButtonColor: '#d33',


          })
          const orderID = response.orderID

          this.router.navigate([`/payment/${orderID}`])

        },
        (error) => {
          console.error('Error creating order:', error.error.error);
          Swal.fire({
            title: 'ORDERS',
            text: error.error.error,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#21cdc0',
            cancelButtonColor: '#d33',


          })

        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  makePayment(){
    
  }
}
