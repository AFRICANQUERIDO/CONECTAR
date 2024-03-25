import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})

export class CustomerDetailsComponent {
  detailsForm!: FormGroup;
  errorMessages: string[] = [];
  successMessage: string = '';
  constructor(private fb: FormBuilder, public customerService: UserServiceService, public authService: AuthServiceService, private route:Router) {

    this.detailsForm = this.fb.group({
      phone_number: ['', Validators.required],
      dob_dd: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(2), Validators.maxLength(2)]],
      dob_mm: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(2), Validators.maxLength(2)]],
      dob_yyyy: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)]],
      gender: ['', Validators.required],
      education: [''],
      experience: [''],
      language: [''],
      about: [''],
      nickname: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.detailsForm.valid) {
      const details = this.detailsForm.value;
      console.log(details)
      // Joining the DD, MM, and YYYY to form the Date of Birth
      const DOB = `${details.dob_yyyy}-${details.dob_mm}-${details.dob_dd}`;

      // Collecting the value of the selected radio button for gender
      const gender = details.gender;

      // You can now use the 'details' object which contains all the form data except DOB and gender
      console.log('Form Details:', details);
      console.log('Date of Birth:', DOB);
      console.log('Gender:', gender);

      const token = localStorage.getItem('token');

      if (token) {
        this.authService.readToken(token).subscribe(
          response => {
            const userID = response.info.userID;
            // console.log('UserID:', userID);

            this.customerService.createProfile(userID, details).subscribe((res) => {
              console.log(res);
              this.successMessage = res.message;
              this.errorMessages = [];
              this.detailsForm.reset();
              this.route.navigate(['/spec-profile'])
            });
          },
          error => {
            console.error('Error reading token:', error);
            this.successMessage = '';

            this.errorMessages = ["An error occurred while submitting the details. Please try again later."];
          }
        );
      }
    }
  }
}