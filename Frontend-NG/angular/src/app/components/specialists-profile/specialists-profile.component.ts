import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gigs, gigDetails } from '../../intefaces/gig.interface';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipePipe } from '../../Pipes/SearchPipe/search-pipe.pipe';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-specialists-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule,  SearchPipePipe],
  templateUrl: './specialists-profile.component.html',
  styleUrl: './specialists-profile.component.css'
})
export class SpecialistsProfileComponent implements OnInit {
  gigs: Gigs[] = [];
  gigDetails: gigDetails[] = [];
  isSearchDivVisible = false;
  searchInput: string = '';
  filter = "";
  averageRating: number | undefined; // Define averageRating as optional

  constructor(
    public gigService: GigsService,
    public authService: AuthServiceService,
    public reviewService:ReviewsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchGigs();
  }

  toggleSearchDiv() {
    this.isSearchDivVisible = !this.isSearchDivVisible;
  }

  performSearch() {
    console.log('Performing search for: ' + this.searchInput);
    this.searchInput = ''; // Reset input
    this.isSearchDivVisible = false;
  }

  fetchGigs() {
    const token = localStorage.getItem('token');
    if (token) {
      this.gigService.getGigs().subscribe(
        (res) => {
          this.gigs = res.gigs;
          console.log(res);
          // Fetch average rating for each gig
          this.gigs.forEach((gig) => {
            this.reviewService. getAverageReview(gig.userID).subscribe(
              (rating) => {
                gig.averageRating = rating;              },
              (error) => {
                console.error('Error fetching average rating:', error);
              }
            );
          });
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
      this.router.navigate([`/spec-page/${gigID}`]);
    });
  }

}