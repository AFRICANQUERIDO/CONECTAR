import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reg-specialist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,NgbTooltipModule],
  templateUrl: './reg-specialist.component.html',
  styleUrl: './reg-specialist.component.css'
})
export class RegSpecialistComponent {
  name ="this is working"
title="already have account?"
  registerForm!: FormGroup
  errorMsg: string = ''
  msgVisible = false
  msgVisible2 = false
  successMsg: string = ''
passwordErr:string=""

  constructor(private formbuilder: FormBuilder, private router: Router) {

    this.registerForm = this.formbuilder.group({
      Name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]]
    })
  }

  registerUser() {

    if (this.registerForm.valid) {


  //     const details: users = this.registerForm.value;
  //     console.log(details)

  //     this.signservices.signUpUser(details).subscribe(
  //       (response) => {
  //         if (response.error) {
  //           this.msgVisible = true;
  //           this.errorMsg = "Email or password is registered";

  //           setTimeout(() => {
  //             this.msgVisible = false;
  //           }, 3000);
  //         } else if (response.message) {
  //           this.msgVisible2 = true;
  //           this.successMsg = response.message;

  //           setTimeout(() => {
  //             this.msgVisible2 = false;
  //             this.router.navigate(['login']);
  //           }, 3000);
  //         }
  //       },
  //       (err) => {
  //        this.registerForm.markAllAsTouched()
  //         console.error(err);
  //       }
  //     );
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
