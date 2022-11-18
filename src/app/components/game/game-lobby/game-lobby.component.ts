import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, concatMap, tap, take, delay, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { HttpService } from 'src/app/services/http.service';
import { QuizService } from 'src/app/services/quiz.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLobbyComponent implements OnInit, OnDestroy {
  subs = new Subscription(); // group of subscriptions
  subsHost: Subscription;

  isLoaded: boolean = false;
  list_of_users_joined = [];
  roomId
  subscriptionGetSocketRoom: Subscription;
  subscriptionDeleteRoom: Subscription

  subscriptionHttpQID: Subscription
  subscriptionHttpR: Subscription

  username;
  nickname;

  isHost: boolean = false;

  @Input() sendNickname: string;

  subscriptionGetQuizId: Subscription
  subscriptionHost: Subscription
  subscriptionElse: Subscription
  subscriptionStartGame: Subscription
  subscriptionSocketStartGame: Subscription
  quizId;
  quizInfo;
  listOfQuestions;

  bob: boolean = false;


  list_of_users = [];
  playGame;
  loaded: boolean = false;
  roomInfo
  socketId
  isGameStart
  quizQuestions;
  currentQuestion;
  questionCounter = 0;
  length;
  selectedAnswer: string;
  points: number = 0;

  answerSelected: Subscription;

  /* 10/16/2022 */
  users$
  userInStartGame: boolean = false;
  

  constructor(private router: Router, private httpService: HttpService, private socketService: SocketService, private authService: AuthService, private gameService: GameService, private quizService: QuizService) {

  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async quizLoop(length, quizQuestions) {


    for (let i = 0; i < length;) {
      await this.httpService.get("getSongById", quizQuestions[i]['songId']).subscribe((res) => {
        // Creates memory leak rn... fix later
        console.log('done')
        console.log(res)
      });


      console.log(quizQuestions)
      console.log(`Waiting ${i} seconds...`);
      this.currentQuestion = this.quizQuestions[i];
      i++;
      console.log(this.currentQuestion.correctAnswer.correctAnswer)
      console.log(this.selectedAnswer)
      await this.sleep(i * 6000);
      if (this.currentQuestion.correctAnswer.correctAnswer == this.selectedAnswer) {
        console.log('in here')
        this.points += 10;
      }
      this.questionCounter = i
    }
    console.log('Done');
  }
  
  ngOnInit() {

    /* Get quizId if user is the Host */
    this.subs.add(this.quizService.selectedQuizId.subscribe((quizId) => {
        this.quizId = quizId;
        console.log(this.quizId);
    }))

    // Init Operations
    if(this.quizId){
      this.hostInit(); // If quizId, then user is host.. run host operations
    }
    else{
      this.init();
    }
    
    // Handle Game after Host presses start button
    this.subs.add(this.socketService.startGame().pipe(delay(1000),take(1)).subscribe((res) => {
      this.isLoaded = false;
      this.isGameStart = true
      console.log("starting game now :)")

      // Handle first initial display
      console.log(this.questionCounter)
      console.log(this.length);

      this.userInStartGame = true;
      this.router.navigate(['/game'], { state: { userInStartGame: this.userInStartGame, quizId: this.quizId, isHost: this.isHost, nickname: this.nickname, socketId: this.socketId, roomId: this.roomId } })
      // this.quizLoop(this.length, this.quizQuestions)
    }))

    // Listen for players joining / leaving
    this.users$ = this.socketService.getNicknameListFromServer();
  }

  init(){
    // If user isn't a host
    if (!this.quizId) {
       this.subs.add(this.gameService.processPin.pipe( // get pin and nickname
        tap(res => {
          this.roomInfo = res['pin']; this.nickname = res['nickname']; this.socketId = res['pin']['socketId'] // set pin and nickname
        }),
        
        tap(() => {console.log(this.socketId)}),
        tap(() => this.socketService.connect()), // connect to socket
        tap(() => this.socketService.emit('joinLobby', { socketId: this.roomInfo.socketId, nickname: this.nickname })), // emit joinLobby event to get ID of host
        
        tap(() => {this.socketService.emit("addUser", {socketId: this.socketId, nickname: this.nickname})}),
        tap(() => this.socketService.emit("getNicknamesInLobby", this.socketId))
        ).subscribe(() => {
        this.roomId = this.roomInfo._id;
        this.socketId = this.roomInfo.socketId;
        this.isLoaded = true;
      }));
    }  
  }

  hostInit(){
    this.isHost = true;
    console.log("User is the host")
      this.subs.add(this.gameService.processQidAndNickname.pipe( // get nickname
        tap((res) => this.nickname = res['nickname']), // set nickname
        tap(() => this.socketService.connect()), // connect socket
        tap(() => this.socketService.emit('createLobby', '')), // emit the event "createLobby" to server
        concatMap(() => this.socketService.getLobbyId()), // create the observable that provides us with the HOST socketId
        tap(socketId => this.socketId = socketId), // use the response from obs and set it
        concatMap(() => this.httpService.post('createRoom', { quizId: this.quizId, socketId: this.socketId })), // creates room in db and stores above info
        tap((res) => {this.roomId = res; this.isLoaded = true;}), // sets ID = to the room object ID
        tap(() => {this.socketService.emit("addUser", {socketId: this.socketId, nickname: this.nickname})}),
        tap(() => this.socketService.emit("getNicknamesInLobby", this.socketId)),
        ).subscribe(()=>{}))
  }

  startGameBtn() {
    // Check for amount of players. Should be at least 1 before starting
    console.log("startGameBtn clicked")
    console.log(this.socketId);
    this.socketService.emit("startGame", { socketId: this.socketId, quizQuestions: this.quizQuestions });
  }

  getSelectedAnswer(selectedAnswer: string) {
    console.log(selectedAnswer);
    this.selectedAnswer = selectedAnswer;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if(!this.userInStartGame){
      this.socketService.emit("deleteUser", {socketId: this.socketId, nickname: this.nickname}); // Delete user from server map - room
      this.socketService.disconnect(); // Removes observable listeners and disconnects socket
      if (this.isHost) { // If user is host and has left the room - delete the room from db
        this.httpService.delete('deleteRoom', this.roomId).pipe(take(1)).subscribe(() => {
        })
      }
    }

  }

}
