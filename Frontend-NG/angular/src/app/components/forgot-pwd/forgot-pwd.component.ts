import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-pwd',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.css'
})
export class ForgotPwdComponent {
  forgotPasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      // Process the form submission (send email, etc.)
      console.log('Forgot password form submitted');
    } else {
      // Mark form controls as touched to display validation errors
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
