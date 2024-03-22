export interface Conversation {
    chatId:string
    profile_pic:string
    last_message:string
    nickname:string
    sender_email:string
    receiver_email:string
}


export interface Message {
    author_email:string
    chatId:string
    message:string
    timestamp:string
}
