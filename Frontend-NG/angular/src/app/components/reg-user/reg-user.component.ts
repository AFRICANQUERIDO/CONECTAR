import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from '../../services/user-service.service';
import { Users } from '../../intefaces/user.interface';

@Component({
  selector: 'app-reg-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink, NgbTooltipModule],
  templateUrl: './reg-user.component.html',
  styleUrl: './reg-user.component.css'
})
export class RegUserComponent {
  title = "already have account?";
  registerForm: FormGroup;
  errorMsg = '';
  msgVisible = false;
  msgVisible2 = false;
  successMsg = '';
  userID = '';

  constructor(private formbuilder: FormBuilder, private router: Router, private signServices: UserServiceService) {
    this.registerForm = this.formbuilder.group({
      Name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [''],
    });
  }

  registerUser() {
    if (this.registerForm.valid) {
      const details: Users = this.registerForm.value;
      this.signServices.signUpUser(details).subscribe(
        (response) => {
          if (response.error) {
            this.msgVisible = true;
            this.errorMsg = "Email or password is registered";
            setTimeout(() => {
              this.msgVisible = false;
            }, 3000);
          } else if (response.message) {
            this.msgVisible2 = true;
            this.successMsg = response.message;

            const userID = response.userID;
          localStorage.setItem("userID", userID); 
          
            
            setTimeout(() => {
              this.msgVisible2 = false;
              this.router.navigate(['/otp']);
            }, 3000);
          }
        },
        (err) => {
          this.registerForm.markAllAsTouched();
          console.error(err);
        }
      );
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.querySelector('[formControlName="password"]') as HTMLInputElement;
    const toggleIcon = document.querySelector('.fa-eye') as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.remove('fa-eye-slash');
      toggleIcon.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      toggleIcon.classList.remove('fa-eye');
      toggleIcon.classList.add('fa-eye-slash');
    }
  }
}