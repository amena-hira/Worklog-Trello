import { Component } from '@angular/core';
import { MessagesHistory } from '../../../../model/messages-history';

@Component({
  selector: 'app-inbox',
  standalone: false,
  templateUrl: './inbox.html',
  styleUrl: './inbox.css',
})
export class Inbox {
  allConversations: MessagesHistory[] = [
    {username: 'user', message: 'Hi!'},
    {username: 'system', message: 'Hi!'},
    {username: 'user', message: 'Hello!'},
    {username: 'system', message: 'How can I help you!'},
    {username: 'user', message: 'I want to know about your services.'},
    {username: 'system', message: 'Sure! We offer a wide range of services including ...'},
    {username: 'user', message: 'That sounds great! Can you tell me more about your pricing?'},
    {username: 'system', message: 'Of course! Our pricing is based on ...'},
    {username: 'user', message: 'Thank you for the information! I will consider it.'},
    {username: 'system', message: 'You are welcome! If you have any more questions, feel free to ask.'},
    {username: 'user', message: 'I will! Thanks again!'},
    {username: 'system', message: 'Have a great day!'},
    {username: 'user', message: 'You too! Goodbye!'},
    {username: 'system', message: 'Goodbye!'}
    
  ];
  isLoading = false;

}
