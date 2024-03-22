import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegUserComponent } from '../reg-user/reg-user.component';
import { RegSpecialistComponent } from '../reg-specialist/reg-specialist.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RegUserComponent, RegSpecialistComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  activeTab: string = 'signupUser';
  onTabClick(tab: any) {
    this.activeTab = tab;
  }

}
