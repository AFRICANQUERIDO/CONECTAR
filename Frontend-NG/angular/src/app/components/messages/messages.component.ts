import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { ButtonModule } from 'primeng/button';
import { Conversation, Message } from '../../intefaces/message';
import { UserDetails } from '../../intefaces/user';
import { ChatService } from '../../services/chat.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SocketsService } from '../../services/sockets.service';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent
 implements  OnInit {
   
   showQualifications: boolean = false;
   AllMessages:Message[]=[];
   convestationList:Conversation[]=[];
   myEmail:string|null =""
   sideMenu:boolean=false;
   activeUser:UserDetails={
     nickname: '', active_chat_id: '',
     profile_pic: ''
                                     
    }
    message: any;
    myMessage:Message={author_email:'',chatId:'',message:'',timestamp:''};
  paramChatId!:String
gigID!: string;
    

   constructor(public messagesService:ChatService, public authServices:AuthServiceService,  private datePipe:DatePipe,private router:Router,private route: ActivatedRoute,private sockectIo:SocketsService,private socket:Socket){}

   async ngOnInit(): Promise<void> {
    this.myEmail=this.authServices.getEmailFromToken();
    console.log(this.myEmail);
    this.paramChatId=this.route.snapshot.paramMap.get('chatId')!;
  
    // this.messagesService.getAllMessages().subscribe({
    //   next: (messages: Message[]) => {
    //     this.AllMessages = messages;
    //   },
    //   error: (error: any) => {
    //     console.error('Error fetching messages:', error);
    //     // Handle error, e.g., show error message
    //   }
    // }
    // )
    try {
     
      let email="";
      if(this.myEmail!=null)
      {
      email=this.myEmail
      }
      // const observable = await this.chatList.getMyConversations();
      const observable= this.messagesService.getConversationsByEmail(email);
      observable.subscribe({
        next: (value: Conversation[]) => {
          this.convestationList = value;
          console.log(this.convestationList)
          // this.convestationList.forEach(e=>console.log(e.last_message))
          if(this.paramChatId!=null || this.paramChatId!=undefined)
    {
      const converstationDefault=this.convestationList.find(e=>e.chatId==this.paramChatId);
      this.OpenChat(converstationDefault!);
    }else
    {
    }
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }

  }
  
    toggleQualifications() {
      this.showQualifications = !this.showQualifications;
    }
    sendMessage():string | null
      {
        // this.sockectIo.notifyOnline(this.myEmail!);
        this.socket.emit('exampleEvent', { message: 'Hello from Angular!' });
        console.log("helllo world");
        let author_email="";
        if(this.myEmail!=null)
        {
          author_email=this.myEmail;
           this.myMessage.author_email=author_email;
                this.myMessage.chatId=this.activeUser.active_chat_id;
                this.myMessage.message=this.message;
                this.myMessage.timestamp='ddd'
    // return "sre";

                this.messagesService.createMessage(this.myMessage).subscribe({next:(value: any)=> {
                  // this.messagesService.add({severity:'success', summary:'Message sent successfully', detail:'Message Content'});
                  // this.messagesService.add({severity: 'success', summary:  'Heading', detail: 'More details....' });
                  this.refreshChat();
                  this.message =""
                
                },
              error:(err: any) =>{
                // this.messagesService.add({severity:'error', summary:'Failed to send the message', detail:'Message Content'});
                  
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
                error:(error: any)=>{
                  console.log(error);
                }
                })

     
      
    }

    async OpenChat(activeConverstion: Conversation) {
    this.activeUser.nickname=activeConverstion.nickname;
    this.activeUser.active_chat_id=activeConverstion.chatId;
    this.activeUser.profile_pic=activeConverstion.profile_pic;
    

    // const currentUrlTree = this.router.parseUrl(this.router.url);
    // currentUrlTree.fragment = activeConverstion.chatId;
    // this.router.navigateByUrl(currentUrlTree);

    // this.router.navigate([], { relativeTo: this.route, queryParams: { chatId: activeConverstion.chatId } });

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { chatId: activeConverstion },
    //   queryParamsHandling: 'merge'
    // });
    // this.router.navigate(["message/",activeConverstion.chatId]);
    const chatId = activeConverstion.chatId;
this.router.navigate([`/message/${chatId}`]);



      (await this.messagesService.getMessageByChatId(activeConverstion.chatId)).subscribe({next:(value:Message[])=> {
        this.AllMessages=value;
          
      },
    error:(error: any)=>{
      this.AllMessages=[]
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

    createOrder(gigID: string) {
      this.router.navigate([`/orderPage/${gigID}`]);
    }
    
    
}