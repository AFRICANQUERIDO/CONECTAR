import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-gig',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-gig.component.html',
  styleUrl: './update-gig.component.css'
})
export class UpdateGigComponent {
  gigUpdateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.gigUpdateForm = this.formBuilder.group({
      gigName: ['', Validators.required],
      gigImage: ['', Validators.required],
      gigDescription: ['', Validators.required],
      rate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.gigUpdateForm.invalid) {
      return;
    }
    
    // Process form submission logic here
    console.log('Form Submitted!');
    console.log(this.gigUpdateForm.value);
  }
}
