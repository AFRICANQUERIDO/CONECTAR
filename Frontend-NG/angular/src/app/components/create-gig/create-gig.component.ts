import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GigsService } from '../../services/gigs.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Gigs } from '../../intefaces/gig.interface';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-create-gig',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-gig.component.html',
  styleUrl: './create-gig.component.css'
})
export class CreateGigComponent {
  gigForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private gigService: GigsService, 
    private authService: AuthServiceService
  ) {
    this.gigForm = this.formBuilder.group({
      gigName: ['', Validators.required],
      gigImage: [''],
      gigDescription: ['', Validators.required],
      rate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.gigForm.valid) {
      this.createGig(this.gigForm.value);
    }
  }

  createGig(details: Gigs) {
const  token = localStorage.getItem('token') as string
        if (!token) {
          console.error('Token not found');
          return;
        }

        this.authService.readToken(token).subscribe(
          (res) => {
            const userID = res.info.userID;
            console.log('User ID:', userID);
            this.gigService.createGig(details, userID).subscribe(
              (res) => {
                console.log('Response', res);
                if (res.message) {
                  console.log(res.message);
                  this.gigForm.reset();
                }
              },
              (error) => {
                console.error('Error creating gig:', error);
              }
            );
          },
          (error) => {
            console.error('Error reading token:', error);
          }
        );
      }
   }