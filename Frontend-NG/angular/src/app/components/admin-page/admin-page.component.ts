import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { Users } from '../../intefaces/user.interface';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  isSidebarOpen = false;
  isSearchDivVisible = false;
  searchInput: string = '';

  id!: string
  user!: Users
  storedUser = ''

  constructor(private router: Router, public userService: AuthServiceService) {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.userService.setUser(storedUser);
      console.log("User details success", storedUser)
    }

  }
  ngOnInit(): void {
    const storedUser = this.userService.getStoredUser();
    if (storedUser) {
      this.userService.setUser(storedUser);
      console.log("User details success", storedUser)
    }

  }
  toggleSearchDiv() {
    this.isSearchDivVisible = !this.isSearchDivVisible;
  }
  performSearch() {
    // search logic
    console.log('Performing search for: ' + this.searchInput);
    // search logic ends here

    this.searchInput = ''; //reseting input
    this.isSearchDivVisible = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;

    setTimeout(() => {
      this.closeSidebar();
    }, 3000)
  }
  closeSidebar() {
    this.isSidebarOpen = false;
  }
  logout() {
    localStorage.clear()
    this.router.navigate([''])
  }
}
