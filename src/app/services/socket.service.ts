import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {io} from "socket.io-client"
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { take, fromEvent } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // taken out for build (Must edit app.module as well)
  private socket = io(environment.socketUrl); 
  // Dev
  // private socket = io("http://localhost:8000");
  // Dev
  // private socket = io("https://audioquery.up.railway.app")

  

  startGameConfirm = new ReplaySubject;
  roomId = new BehaviorSubject<string>("0");
  triggerGetNickname = new Subject();
  sendNicknameGetUserList = new Subject();
  joinedLobby = new Subject();

  users = new Subject();

  updateUlist = new Subject();

  usersList = new Subject();

  lobbyId = new Subject();

  constructor(private httpService: HttpService){
    
  }

  getNicknameListFromServer(){
    console.log("In GetNicknameListFromServer")
    let observable = new Observable(observer => {
      this.socket.on('deliverNicknameListToClient', (data) => {
        console.log("deliverNicknameListToClient")
        console.log(data);
        let list = [];
        data.forEach(nick => {
          console.log(nick);
          console.log(list);
          list.push(nick.nickname)
        });
        observer.next(list)
      });
    });
    return observable;
  }

  getRoomList(room, socketId){
    console.log("in getRoomList")
    this.httpService.get("getRoom", room).pipe(take(1)).subscribe((data) => {
      console.log("got data..")
      console.log(socketId)
      console.log(data)
      this.socket.emit("updateUserListServer", {socketId: socketId, data: data});
    })
  }

  connect(){
    this.socket.connect();
  }

  disconnect(){
    this.socket.removeAllListeners();
    this.socket.disconnect();
    // this.socket.removeListener('joinLobby');
  }

  emit(event: string, data){ // Wrapper for emitting
    this.socket.emit(event, data)
  }

  getLobbyId(){
    let observable = new Observable(observer => {
      this.socket.once('sendId', (data) => {
        console.log('Received ID')
        observer.next(data);
      });
    });
    return observable;
  }


  /* Game */
  receiveCurrentQuestion(){
    {
      let observable = new Observable(observer => {
        this.socket.on('receiveCurrentQuestion', (data) => {
          console.log("receiveCurrentQuestion")
          observer.next(data);
        });
      });
      return observable;
    }
  }

  onHostLeaving(){
    {
      let observable = new Observable(observer => {
        this.socket.on('relayHostLeavingToListeners', (data) => {
          console.log("hostLeft")
          observer.next(data);
        });
      });
      return observable;
    }
  }


  allAnswersReceived(){
    {
      let observable = new Observable(observer => {
        this.socket.on('allAnswersReceived', (data) => {
          console.log("allAnswersReceived")
          observer.next(data);
        });
      });
      return observable;
    }
  }

  onQuizEnd(){
    {
      let observable = new Observable(observer => {
        this.socket.on('onQuizEnd', (data) => {
          console.log('onQuizEnd')
          observer.next(data);
        });
      });
      return observable;
    }
  }



/* Not working - Verify this*/

  startGame(){
    let observable = new Observable(observer => {
      this.socket.once('startGameConfirmed', (socketId) => {
        // console.log(socketId);
        console.log('in socket.service - startGame')
        // this.startGameConfirm.next(socketId)
        observer.next({socketId: socketId})
      });
    });
    return observable;
  }

}
