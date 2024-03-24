import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  detailsForm!: FormGroup;

  constructor(private fb: FormBuilder, public customerService: UserServiceService) { }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob_dd: ['', Validators.required],
      dob_mm: ['', Validators.required],
      dob_yyyy: ['', Validators.required],
      gender: ['', Validators.required],
      qualification: [''],
      experience_years: [''],
      languages: [''],
      about: [''],
      city: [''],
      address1: [''],
      address2: [''],
      service: ['']
    });
  }

  onSubmit() {
    // if (this.detailsForm.valid) {
    //   this.customerService.createProfile(this.detailsForm.valid.value).subscribe((res) => {
    //     this.detailsForm.value = this.res
    //   })
    //   console.log(this.detailsForm.value);
    }
  // }
}
