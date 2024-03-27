import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-gig',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-gig.component.html',
  styleUrl: './update-gig.component.css'
})
export class UpdateGigComponent {
gigUpdateForm!:FormGroup
}
