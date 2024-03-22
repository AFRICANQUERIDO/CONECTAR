import { Component } from '@angular/core';
import { ViewUsers } from '../../intefaces/user.interface';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  users: ViewUsers[] = [];
  error: string = '';

  constructor(private userService: UserServiceService) {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data.users;
        this.error = data.error;
      },
      error => {
        console.error('Error fetching users:', error);
        this.error = 'Failed to fetch users';
      }
    );
  }
}

