import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { industry } from '../../intefaces/industry';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-specialist-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './specialist-details.component.html',
  styleUrl: './specialist-details.component.css'
})
export class SpecialistDetailsComponent implements OnInit { 

  personalDetailsForm!: FormGroup;
  addressInformationForm!: FormGroup;
  preferredServiceForm!: FormGroup;
  currentForm: string = 'personalDetails';
  // personalDetailsForm!:FormGroup;
  industriesArray: industry[] = [];

  switchToPersonalDetailsForm(): void {
    this.currentForm = 'personalDetails';
  }

  switchToAddressInformationForm(): void {
    this.currentForm = 'addressInformation';
  }

  switchToPreferredServiceForm(): void {
    this.currentForm = 'preferredService';
  }
  constructor(
    private fb: FormBuilder,
    private industryService: GigsService,
    private authService: AuthServiceService,
    private customerService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.initPersonalDetailsForm();
    this.initAddressInformationForm();
    this.initPreferredServiceForm();
    this.getIndustries();
  }

  initPersonalDetailsForm(): void {
    this.personalDetailsForm = this.fb.group({
      phone_number: ['', Validators.required],
      // dob_dd: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(2), Validators.maxLength(2)]],
      // dob_mm: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(2), Validators.maxLength(2)]],
      // dob_yyyy: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)]],
      DOB: ['', Validators.required], 

      gender: ['', Validators.required],
      education: [''],
      experience: [''],
      language: [''],
      about: ['']
    });
  }
  
  initAddressInformationForm(): void {
    this.addressInformationForm = this.fb.group({
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
    // this.onSubmit()
  }

  initPreferredServiceForm(): void {
    this.preferredServiceForm = this.fb.group({
      industrySelect: ['', Validators.required],
      service: ['']
    });
    // this.onSubmit()
  }
  onSubmit(formName: string): void {
    console.log("clicked");
    let form: FormGroup;
    switch (formName) {
      case 'personalDetails':
        form = this.personalDetailsForm;
        break;
      case 'addressInformation':
        form = this.addressInformationForm;
        break;
      case 'preferredService':
        form = this.preferredServiceForm;
        break;
      default:
        return;
    }
  
    console.log("Form Status:", form.status);
    console.log("Form Errors:", form.errors);
  
    if (form.valid) {
      console.log("Form is valid");
      const details = form.value;
      const DOB = `${details.dob_yyyy}-${details.dob_mm}-${details.dob_dd}`;

      const gender = form.get('gender')?.value;
      console.log('Selected Gender:', gender);

      const genderValue = details.gender;
  
      console.log('Form Details:', details);
      console.log('Date of Birth:', DOB);
      console.log('Gender:', gender);
  
      const token = localStorage.getItem('token');
      console.log("Token:", token);
      
      if (token) {
        this.authService.readToken(token).subscribe(
          response => {
            const userID = response.info.userID;
            console.log('UserID:', userID);
  
            this.customerService.createProfile(userID, details).subscribe(
              (res) => {
                console.log('Profile creation response:', res);
                form.reset();
              },
              (error) => {
                console.error('Error creating profile:', error);
                // Add error handling logic here
              }
            );
          },
          (error) => {
            console.error('Error reading token:', error);
            // Add error handling logic here
          }
        );
      } else {
        console.error("Token not found or invalid.");
      }
    } else {
      console.error("Form is not valid.");
    }
  }
  // In your component class

submitPersonalDetailsForm(): void {
  if (this.personalDetailsForm.valid) {
    // Submit personal details form logic here
    const form = this.personalDetailsForm;

    if (form.valid) {
      const details = form.value;
      
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.readToken(token).subscribe(
          response => {
            const userID = response.info.userID;
            this.customerService.createProfile(userID, details).subscribe(
              (res) => {
                this.switchToAddressInformationForm(); // Switch to the next form

                console.log('Profile creation response:', res);
                form.reset();
              },
              (error) => {
                console.error('Error creating profile:', error);
                // Handle error here
              }
            );
          },
          (error) => {
            console.error('Error reading token:', error);
            // Handle error here
          }
        );
      } else {
        console.error("Token not found or invalid.");
      }
    } else {
      console.error("Form is not valid.");
    }
    console.log('Personal details form submitted successfully');
    
  
  } else {
    console.log('Personal details form is not valid');
  }
}

submitAddressInformationForm(): void {
  if (this.addressInformationForm.valid) {
    const form = this.addressInformationForm;
    const details = form.value;

    const token = localStorage.getItem('token');
    if (token) {
      this.authService.readToken(token).subscribe(
        response => {
          const userID = response.info.userID;
          this.customerService.createProfile(userID, details).subscribe(
            (res) => {
              this.switchToPreferredServiceForm(); // Switch to the next form
              console.log('Profile creation response:', res);
              form.reset(); // Reset the form
            },
            (error) => {
              console.error('Error creating profile:', error);
              // Handle error here
            }
          );
        },
        (error) => {
          console.error('Error reading token:', error);
          // Handle error here
        }
      );
    } else {
      console.error("Token not found or invalid.");
    }
  } else {
    console.error('Address information form is not valid');
  }
}

submitPreferredServiceForm(): void {
  if (this.preferredServiceForm.valid) {
    const form = this.preferredServiceForm;
    const details = form.value;

    const token = localStorage.getItem('token');
    if (token) {
      this.authService.readToken(token).subscribe(
        response => {
          const userID = response.info.userID;
          this.customerService.createProfile(userID, details).subscribe(
            (res) => {
              console.log('Profile creation response:', res);
              // Optionally, perform additional actions here
              form.reset(); // Reset the form
            },
            (error) => {
              console.error('Error creating profile:', error);
              // Handle error here
            }
          );
        },
        (error) => {
          console.error('Error reading token:', error);
          // Handle error here
        }
      );
    } else {
      console.error("Token not found or invalid.");
    }
  } else {
    console.error('Preferred service form is not valid');
  }
}

  
  getIndustries(): void {
    this.industryService.getIndustries().subscribe((res) => {
      this.industriesArray = res.industries;
      console.log(this.industriesArray);
    });
  }
    
} 

