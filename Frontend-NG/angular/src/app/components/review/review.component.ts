import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  reviewForm!: FormGroup;
  isFormVisible = true;
  orderID: string | null = null; 

  constructor(private fb: FormBuilder, private reviewService: ReviewsService, public authService: AuthServiceService) { }

  ngOnInit(): void {
    this.orderID = localStorage.getItem('orderID'); 

    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', Validators.required]
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.orderID) { 
      const reviewData = this.reviewForm.value;
      
      const token = localStorage.getItem('token') as string;
      this.authService.readToken(token).subscribe(
        (token) => { 
          if (token) {
            reviewData.userID = token.info.userID;
            reviewData.orderID = this.orderID;
            this.reviewService.createReview(reviewData).subscribe(
              response => {
                Swal.fire({
                  title: 'Review Submission',
                  text: 'Your review has been submitted successfully.',
                  icon: 'success'
                });
                this.reviewForm.reset();
                console.log('Review submitted successfully:', response);
              },
              error => {
                Swal.fire({
                  title: 'Error',
                  text:'Review already made for this order',
                  icon: 'error'
                });
                this.reviewForm.reset();
                console.error('Error submitting review:', error);
              }
            );
          }
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while reading token. Please try again later.',
            icon: 'error'
          });
          // this.reviewForm.reset();
          console.error('Error reading token:', error);
        }
      );
    } else {
      console.log("error");
    }
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.reviewForm.reset();
  }
}