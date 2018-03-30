import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiAiClient } from 'api-ai-javascript';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


/*Create a Message class to format messages
Initialize Dialogflow (ApiAiClient) with your API token.
Define a BehaviorSubject that is an array of messages.
The converse method adds a user message to the array, then hits 
the API and updates the bot’s response in the same array. */

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken:this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  converse(msg: string){

    const userMessage = new Message (msg, 'user' );
    this.update(userMessage);


   return this.client.textRequest(msg).then
    (res=>{
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage)
    });

  }


  update (msg:Message)
  {
    this.conversation.next([msg])
  }

}
