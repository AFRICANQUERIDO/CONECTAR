import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from '../../services/user-service.service';
import { loginDetails } from '../../intefaces/user.interface';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbTooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';

  msgVisible = false
  msgVisible2 = false
 title = "Don't have account?"
  constructor(private formBuilder: FormBuilder, private userService: UserServiceService, private authService:AuthServiceService, private router: Router) { }

  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginUser(){
    if (this.loginForm.valid) {
      const userDetails: loginDetails = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userService.loginUser(userDetails).subscribe(
        res => {
          if (res) {
            console.log(res)
            localStorage.setItem('token', res.token);
            this.authService.setUser(res);

            this.authService.readToken(res.token).subscribe(
              response => {
                if (response.info.role === 'user') {
                  this.displaySuccess(res.message, '/user-dashboard');
                } else if (response.info.role === 'specialist') {
                  this.displaySuccess(res.message, '/specialist-dashboard');
                } else if (response.info.role === 'Admin') {
                  this.displaySuccess(res.message, '/admin-dashboard');
                } else if (response.info.role === 'NULL') {
                }
              },
              error => {
                console.error('Error reading token:', error);
                this.displayError('An error occurred while processing your request.');
              }
            );
          }
        },
        error => {
          console.error('Error logging in:', error);
          this.displayError('An error occurred while logging in. Please try again later.');
        }
      );
    } else {
      this.displayError('Please fill in all the fields correctly');
    }
  }

  togglePasswordVisibility(): void {
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

  displayError(message: string): void {
    this.errorMsg = message;
    setTimeout(() => {
      this.errorMsg = '';
    }, 5000);
  }

  displaySuccess(message: string, route: string): void {
    this.successMsg = message;
    setTimeout(() => {
      this.successMsg = '';
      this.router.navigate([route]);
    }, 3000);
  }
}

