import { Component, OnInit } from '@angular/core';
import { ViewUsers } from '../../intefaces/user.interface';
import { UserServiceService } from '../../services/user-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  users: ViewUsers[] = [];
  error: string = '';

  constructor(public userService: UserServiceService, public authService: AuthServiceService) {
    this.fetchUsers();
  }

  ngOnInit() {
  }
  fetchUsers() {

    const token = this.authService.getToken();

    // Check if token exists
    if (token) {
      // Call readToken() to verify token and get user details
      this.authService.readToken(token).subscribe(
        (res) => {
          if (res.info.role === 'admin') {

            this.userService.getAllUsers().subscribe(
              (res) => {
                this.users = res.users;
                console.log("users", res.users)

              },
              (error) => {
                console.error('Error fetching users:', error);
                this.error = 'Failed to fetch users';
              }
            );
          } else {
            console.error('Unauthorized access: User is not an admin');
            this.error = 'Unauthorized access: User is not an admin';
          }
        },
        (error) => {
          console.error('Error reading token:', error);
          this.error = 'An error occurred while processing your request';
        }
      );
    } else {
      console.error('Token not found in local storage');
      this.error = 'Token not found in local storage';
    }
  }


  confirmDeleteUser(userID: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#21cdc0 ',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(userID);
      }
    });
  }

  deleteUser(userID: string) {
    this.userService.deleteUser(userID).subscribe(
      () => {
        this.users = this.users.filter(user => user.userID !== userID);
        console.log('User deleted successfully');
      },
      (error) => {
        console.error('Error deleting user:', error);

      }
    );
  }
}