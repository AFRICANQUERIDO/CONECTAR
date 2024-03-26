import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsService } from '../../services/reviews.service';
import { Review } from '../../intefaces/review.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
//   private modalService = inject(NgbModal);
//   closeResult = '';
//   // Define dp property
//   dp: any; // You can replace 'any' with the correct type if known

//   open(content: TemplateRef<any>) {
//     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
//       (result) => {
//         this.closeResult = `Closed with: ${result}`;
//       },
//       (reason) => {
//         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//       },
//     );
//   }

//   private getDismissReason(reason: any): string {
//     switch (reason) {
//       case ModalDismissReasons.ESC:
//         return 'by pressing ESC';
//       case ModalDismissReasons.BACKDROP_CLICK:
//         return 'by clicking on a backdrop';
//       default:
//         return `with: ${reason}`;
//     }
//   }
// }

// rating: number = 0; // Initialize to 0
//   reviewText: string = ''; // Initialize to empty string

//   constructor(private router: ActivatedRoute, private reviewService: ReviewsService, private modalService: NgbModal) {}

//   submitReview() {
//     const reviewData: Review = {
//       rating: this.rating,
//       reviewText: this.reviewText,
//       userID: localStorage.getItem('userID') as string,
//       orderID: this.router.snapshot.params['id'],
//     };

//     this.reviewService.createReview(reviewData).subscribe(
//       response => {
//         console.log('Review submitted successfully:', response);
//         // Optionally, you can navigate to a different page or display a success message
//       },
//       error => {
//         console.error('Error submitting review:', error);
//         // Optionally, you can display an error message to the user
//       }
//     );

//     // Reset form fields and close the modal
//     this.rating = 0;
//     this.reviewText = '';
//     this.modalService.dismissAll();
//   }

  reviewForm!: FormGroup;
  isFormVisible = true;
  constructor(private fb: FormBuilder, private reviewService: ReviewsService, public authService:AuthServiceService) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      reviewText: ['', Validators.required]
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      this.reviewService.createReview(reviewData).subscribe(
        response => {
          console.log('Review submitted successfully:', response);
          const reviewData = this.reviewForm.value;
          const token = localStorage.getItem('token') as string;
          this.authService.readToken(token).subscribe(
            token => {
              if (token) {
                reviewData.userID = token.userID;
              }
            }
          )
         
        },
        error => {
          console.error('Error submitting review:', error);
        }
      );
    } else {
    }
  }
  closeForm(): void {
    this.isFormVisible = false;
  }
}
