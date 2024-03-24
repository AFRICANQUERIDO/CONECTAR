import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GigsService } from '../../services/gigs.service';

@Component({
  selector: 'app-create-gig',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-gig.component.html',
  styleUrl: './create-gig.component.css'
})
export class CreateGigComponent {
  gigForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private gigService: GigsService) {
    this.gigForm = this.formBuilder.group({
      gigName: ['', Validators.required],
      gigImage: [''],
      gigDescription: ['', Validators.required],
      rate: ['', Validators.required],
      userID: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.gigForm.valid) {
      this.gigService.createGig(this.gigForm.value).subscribe(
        (response) => {
          console.log('Gig created successfully:', response);
          // Optionally, you can redirect the user to another page or show a success message
        },
        (error) => {
          console.error('Error creating gig:', error);
          // Handle error, show error message to the user, etc.
        }
      );
    } else {
      console.error('Form is not valid.');
      // Optionally, you can display an error message to the user indicating that the form is not valid
    }
  }
}
