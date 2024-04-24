import { Component, OnInit } from '@angular/core';
import { GigsService } from '../../services/gigs.service';
import { Order, orderResponse } from '../../intefaces/gig.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent implements OnInit {
  // orders: Order[] = [];

  customerOrders: orderResponse[] = [];
  customerId: string = ''

  constructor(private api: GigsService) { }

  ngOnInit() {
    this.customerId = localStorage.getItem('UserID') as string;
    if (this.customerId) {
      this.loadOrders();
    } else {
      console.error('Customer ID not found in local storage.');
    }
  }

  loadOrders() {
    this.api.getOrders(this.customerId)
      .subscribe(
        (response) => {
          this.customerOrders = response.order;
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
  }
}