import { Component } from '@angular/core';
import { GigResponse } from '../../intefaces/gig.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { GigsService } from '../../services/gigs.service';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../intefaces/message';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-specialist-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './specialist-page.component.html',
  styleUrl: './specialist-page.component.css'
})
export class SpecialistPageComponent {
  specialistId!: string;
  gigID!: string;
  specialize: any;
  gig: any = {};
  conversation: Conversation | undefined;
  myemail!: string;

  constructor(
    private route: ActivatedRoute,
    private specializeService: GigsService,
    private chatservice: ChatService,
    private tokenservice: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log("Token:", token);

    if (token) {
      this.tokenservice.readToken(token).subscribe(
        response => {
          this.myemail = response.info.email
          console.log('myEmail:', this.myemail);
        })
    }

    this.specialistId = this.route.snapshot.paramMap.get('id')!;
    // this.getSpecialistDetails();
    this.gigID = this.route.snapshot.paramMap.get('id')!;
    console.log("gigID:", this.gigID)
    this.getGigDetails(this.gigID)
  }

  // getSpecialistDetails(): void {
  //   // const id = parseInt(this.specialistId);
  //   this.specializeService.getGigbyID(this.specialistId).subscribe(
  //     (res) => {
  //       console.log('Gig Information Response:', res);
  //       if (res.gig) {
  //         this.gig = res.gig;

  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching gig:', error);
  //     }
  //   );
  // }
  getGigDetails(gigID: string): void {
    this.specializeService.getGigbyID(gigID).subscribe(
      (response) => {
        this.gig = response;
        console.log('Fetched Gig:', this.gig);
      },
      (error) => {
        console.error('Error fetching Gig:', error);
      }
    );
  }

  messageSpecialist() {
    this.conversation = {
      chatId: '',
      last_message: 'new message',
      nickname: this.gig.Name,
      profile_pic: this.gig.profile_pic,
      receiver_email: this.gig.email,
      sender_email: this.myemail,
      gig_id: this.gigID
    };
    this.chatservice.createConversation(this.conversation).subscribe(
      {
        next: (res) => {
          const chatId = res.chatId;
          this.router.navigate(['/message/', chatId]);
        },
        error: (error) => {
          console.error('Error creating conversation:', error);
        }
      }
    );
  }
}
