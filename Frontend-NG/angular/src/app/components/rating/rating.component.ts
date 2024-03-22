import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbRating, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, NgbRatingModule,NgbRating, ReactiveFormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
    ctrl = new FormControl<number | null>(null, Validators.required);
  
    toggle() {
      if (this.ctrl.disabled) {
        this.ctrl.enable();
      } else {
        this.ctrl.disable();
      }
    }
  }

