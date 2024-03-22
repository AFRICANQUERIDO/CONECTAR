import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  otpForm!: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private formBuilder: FormBuilder, public otpService: UserServiceService) { }

  ngOnInit(): void {
    this.otpForm = this.formBuilder.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required]
    });
  }

  onOtpSubmit(): void {
    if (this.otpForm.valid) {
      // Concatenate the digits to form the complete OTP code
      const otpCode = Object.values(this.otpForm.value).join('');
      console.log('OTP submitted:', otpCode);

      // Call the service method to validate the OTP
      this.otpService.validateUser("userID", otpCode).subscribe({
        next: () => {
          // Reset error message and set success message
          this.errorMsg = null;
          this.successMsg = 'OTP submitted successfully';
        },
        error: () => {
          // Set error message
          this.errorMsg = 'Invalid OTP';
          this.successMsg = null;
        }
      });
    } else {
      // Mark fields as touched to show validation messages
      this.otpForm.markAllAsTouched();

      // Set error message
      this.errorMsg = 'Please fill in all digits of the OTP';
      this.successMsg = null;
    }
  }
}
