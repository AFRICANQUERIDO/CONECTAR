import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-specialist-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './specialist-details.component.html',
  styleUrl: './specialist-details.component.css'
})
export class SpecialistDetailsComponent {
  detailsForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
    if (this.detailsForm.valid) {
      // Handle form submission
      console.log(this.detailsForm.value);
    }
  }
}
