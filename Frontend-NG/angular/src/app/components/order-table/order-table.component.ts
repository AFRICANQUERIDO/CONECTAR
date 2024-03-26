import { Component } from '@angular/core';
import { GigsService } from '../../services/gigs.service';
import { Order } from '../../intefaces/gig.interface';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {
  orders: Order[] = [];

  constructor(private api: GigsService) {
    this.fetchSpecOrders();
  }

  fetchSpecOrders() {
    // this.api.getOrders(id:string).subscribe((res) => {
    //   console.log(res);

    //   this.orders= res.spec_orders;
    // });
  }
}

