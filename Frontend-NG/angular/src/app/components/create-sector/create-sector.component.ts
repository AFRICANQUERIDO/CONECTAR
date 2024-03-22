import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service.service';
import { GigsService } from '../../services/gigs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-sector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-sector.component.html',
  styleUrl: './create-sector.component.css'
})
export class CreateSectorComponent {
  sectorForm!: FormGroup;
  visible = false;
  visible2 = false;
  errorMsg: string =''
  successMsg: string=''
  industries: { id: number, name: string }[] = [ // Assuming you have a list of industries
    { id: 1, name: 'Industry 1' },
    { id: 2, name: 'Industry 2' },
    { id: 3, name: 'Industry 3' }
  ];

  constructor(private fb: FormBuilder, public sectorService: GigsService) {
    this.sectorForm = this.fb.group({
      industrySelect: ['', Validators.required],
      sectorName: ['', Validators.required],
      sectorDescription: ['', Validators.required]
    });
  }

  addSector() {
    if (this.sectorForm.valid) {
      const selectedIndustryId = this.sectorForm.value.industrySelect;
      const sectorData = {
        industryId: selectedIndustryId,
        sectorName: this.sectorForm.value.sectorName,
        sectorDescription: this.sectorForm.value.sectorDescription
      };

  //     this.sectorService.createSector(sectorData).subscribe(
  //       (response) => {
  //         this.successMsg = "Sector created successfully!";
  //         this.visible2 = true;
  //         // Clear form after successful submission
  //         this.sectorForm.reset();
  //       },
  //       (error) => {
  //         this.errorMsg = "Error occurred while creating sector.";
  //         this.visible = true;
  //       }
  //     );
  //   } else {
  //     // Form is invalid, mark all fields as touched to show validation messages
  //     this.sectorForm.markAllAsTouched();
    }
  }
}

