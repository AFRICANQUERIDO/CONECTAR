import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgbAccordionModule, NgbCarouselConfig, NgbCarouselModule, NgbDropdownModule, NgbModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-landing',
  standalone: true, 
  imports: [CommonModule, NavbarComponent,NgbModule, NgbAccordionModule, NgbCarouselModule, NgbScrollSpyModule,NgbDropdownModule,FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})

export class LandingComponent {
  items = ['Job rates', 'Do you accept Paypal?', 'Is my personal information safe?'];
  info1 = "Your privacy is very important to us.Learn more about Conectar Privacy Policy, which is part of our Terms of Service. "
  info2 = "You can purchase Gigs using PayPal or a credit card. Businesses pay only for tasks they are satisfied with. Conectar does not charge a fees for tasks that do not meet requirements set in the job."

  itemCollapsed = false;

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  showNavigationArrows = false;
  showNavigationIndicators = false;

  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;

  }
}
