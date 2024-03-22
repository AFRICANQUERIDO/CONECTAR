import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-wild-card',
  standalone: true,
  imports: [NavbarComponent, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './wild-card.component.html',
  styleUrl: './wild-card.component.css'
})
export class WildCardComponent {

}
