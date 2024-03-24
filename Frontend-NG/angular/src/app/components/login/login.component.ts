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
  constructor(private formBuilder: FormBuilder, private userService: UserServiceService, private authService: AuthServiceService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      const userDetails: loginDetails = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userService.loginUser(userDetails).subscribe(
        res => {
          if (res) {
            console.log(res);
            this.successMsg = res.message;
            this.msgVisible = true;
            localStorage.setItem('token', res.token);
            this.authService.setUser(res);
  
            const token = localStorage.getItem('token');
  
            if (token) {
              this.authService.readToken(token).subscribe(
                response => {
                  const userID = response.info.userID;
                  console.log('UserID:', userID);
  
                  if (response.info.role === 'customer') {
                    this.displaySuccess(res.message, `cust-detail/${userID}`);
                  } else if (response.info.role === 'specialist') {
                    this.displaySuccess(res.message, `spec-detail/${userID}`);
                  } else if (response.info.role === 'admin') {
                    this.displaySuccess(res.message, 'admin/all-users');
                  } else if (response.info.role === 'NULL') {
                  }
                },
                error => {
                  console.error('Error reading token:', error);
                  this.errorMsg = res.error;
                  this.msgVisible2 = true;
                }
              );
            }
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

