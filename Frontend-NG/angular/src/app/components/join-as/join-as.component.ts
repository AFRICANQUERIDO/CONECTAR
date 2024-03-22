import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-join-as',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, CommonModule,NavbarComponent, FormsModule, RouterLink],
  templateUrl: './join-as.component.html',
  styleUrl: './join-as.component.css'
})
export class JoinAsComponent {
  roleForm!: FormGroup;
  errorMsg!: string;
  successMsg!:String;
  userID!: string;

  successDiv = false;
  errorDiv = false;

  constructor(private fb: FormBuilder, private userService:AuthServiceService) {
    this.roleForm = this.fb.group({
      role:['',Validators.required]
    })
  }

  selectSpeciliast(){
    this.userService.role = 'specialist'
    console.log(this.userService.role)
  }
selectCustomer(){
  this.userService.role='customer'
  console.log(this.userService.role)
}
  displayErrors(msg:string){
    this.errorMsg = msg;
    this.errorDiv = true;
    setTimeout(() => {
      this.errorDiv = false
    }, 2000);
  }
}

