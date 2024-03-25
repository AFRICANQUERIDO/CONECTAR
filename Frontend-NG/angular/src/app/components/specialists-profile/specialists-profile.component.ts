import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Gigs, gigDetails } from '../../intefaces/gig.interface';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specialists-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './specialists-profile.component.html',
  styleUrl: './specialists-profile.component.css'
})
export class SpecialistsProfileComponent {
  gigs: Gigs[] = [];
  gigDetails: gigDetails[] = [];

  constructor(public gigService: GigsService, public authService: AuthServiceService, private route:Router) {
    this.fetchGigs();
  }

  fetchGigs() {
    const token = localStorage.getItem('token');
    if (token) {
      this.gigService.getGigs().subscribe(
        (res) => {
          this.gigs = res.gigs;
          console.log(res)
        },
        (error) => {
          console.error('Error fetching gigs:', error);

        }
      );
    } else {
      console.error('Token not found');

    }
  }
  
  viewGigDetails(gigID: string) {
    this.gigService.getGigbyID(gigID).subscribe((res) => {
      this.gigDetails = res;
      this.route.navigate([`/spec-page/${gigID}`]);
    });
  }
}


