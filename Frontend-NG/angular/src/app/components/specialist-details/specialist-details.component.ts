import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { industry } from '../../intefaces/industry';
import { GigsService } from '../../services/gigs.service';

@Component({
  selector: 'app-specialist-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './specialist-details.component.html',
  styleUrl: './specialist-details.component.css'
})
export class SpecialistDetailsComponent {
  detailsForm!: FormGroup;
  industriesArray: industry[] = []

  constructor(private fb: FormBuilder, public industryService:GigsService) {
    this.getIndustries()
   }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      phone: ['', Validators.required],
      dob_dd: ['', Validators.required],
      dob_mm: ['', Validators.required],
      dob_yyyy: ['', Validators.required],
      gender: ['', Validators.required],
      education: [''],
      experience: [''],
      language: [''],
      about: [''],
      country:[''],
      city: [''],
      nickname: [''],
      industry:[''],
      service: ['']
    });
   
  }
  getIndustries() {
    this.industryService.getIndustries().subscribe((res) => {
      this.industriesArray = res.industries
      console.log(this.industriesArray)
    })
  }
  // onIndustryChange(industryId: any): void {
  //   this.userService.getSectorsForIndustry(industryId).subscribe(data => {
  //     this.sectorsArray = data; // Assuming API response is an array of sectors
  //   });
  // }
  
  onSubmit() {
    if (this.detailsForm.valid) {
      
      console.log(this.detailsForm.value);
    }
  }
}
