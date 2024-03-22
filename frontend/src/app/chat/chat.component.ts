import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from '../Models/message';
import { ChatMessagesService } from '../services/chat-messages.service';
import { ChatService } from '../services/chat-service.service';
import { Console, error } from 'console';
import { Conversation } from '../Models/conversation';
import { userInfo } from 'os';
import { UserDetails } from '../Models/user-details';
import { TokenServiceService } from '../services/token-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,ToastModule,ButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements  OnInit {

   showQualifications: boolean = false;
   AllMessages:Message[]=[];
   convestationList:Conversation[]=[];
   myEmail:string|null="leon@gmail.com";
   sideMenu:boolean=false;
   activeUser:UserDetails={username:'',active_chat_id:''}
    message: any;
    myMessage:Message={author_email:'',chatId:'',message:'',timestamp:''}
    

    

   constructor(private messagesService:ChatMessagesService,private datePipe:DatePipe,private chatList:ChatService,private tokenservice:TokenServiceService,private toastService:MessageService){}
   async ngOnInit(): Promise<void> {
    this.myEmail=this.tokenservice.getEmailFromToken();
    console.log(this.myEmail);
    this.AllMessages = this.messagesService.getDummyChatMessages();
    try {
     
      let email="";
      if(this.myEmail!=null)
      {
      email=this.myEmail
      }
      // const observable = await this.chatList.getMyConversations();
      const observable= this.chatList.getConversationsByEmail(email);
      observable.subscribe({
        next: (value: Conversation[]) => {
          this.convestationList = value;
          console.log(this.convestationList)
          // this.convestationList.forEach(e=>console.log(e.last_message))
        },
        error: (err) => {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }

  }
  
    toggleQualifications() {
      this.showQualifications = !this.showQualifications;
    }
    sendMessage():string | null
      {
        let author_email="";
        if(this.myEmail!=null)
        {
          author_email=this.myEmail;
           this.myMessage.author_email=author_email;
                this.myMessage.chatId=this.activeUser.active_chat_id;
                this.myMessage.message=this.message;
                this.myMessage.timestamp='ddd'
                this.messagesService.createMessage(this.myMessage).subscribe({next:(value)=> {
                  this.toastService.add({severity:'success', summary:'Message sent successfully', detail:'Message Content'});
                  this.toastService.add({severity: 'success', summary:  'Heading', detail: 'More details....' });
                  this.refreshChat();
                

                    
                },
              error:(err) =>{
                this.toastService.add({severity:'error', summary:'Failed to send the message', detail:'Message Content'});
                  
              },
              })
              console.log(this.message);
              
          return ""

        }else
        {
          return null
        }
     
       
      }
    async refreshChat()
    {
   
      (await this.messagesService.getMessageByChatId(this.activeUser.active_chat_id)).subscribe({next:(value:Message[])=> {
                    this.AllMessages=value;
                      
                  },
                error:(error)=>{
                  console.log(error);
                }
                })

     
      
    }

    async OpenChat(activeConverstion: Conversation) {
    this.activeUser.username=activeConverstion.username;
    this.activeUser.active_chat_id=activeConverstion.chatId;
      (await this.messagesService.getMessageByChatId(activeConverstion.chatId)).subscribe({next:(value:Message[])=> {
        this.AllMessages=value;
          
      },
    error:(error)=>{
      console.log(error);
    }
    })
    
    }

    getFormatedDate(message:Message):string|null
    {
      return this.datePipe.transform(message.timestamp, 'dd/MM/yyyy HH:mm:ss a')
    }

    isMyMessage(message:Message):boolean
    {
      return message.author_email==this.myEmail
      
    }    
    manageSideMenu(isMenuOpen:boolean):void
    {
      this.sideMenu=isMenuOpen;
    }

}
