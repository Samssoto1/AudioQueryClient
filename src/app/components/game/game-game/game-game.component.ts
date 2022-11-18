import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, concatMap, tap, take, delay, timer, Observable, map } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { HttpService } from 'src/app/services/http.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game-game',
  templateUrl: './game-game.component.html',
  styleUrls: ['./game-game.component.css']
})
export class GameGameComponent implements OnInit, OnDestroy{

  subs = new Subscription;
  subscription: Subscription

  // Init
  userInStartGame: boolean = false;
  isHost: boolean = false;
  nickname;
  username; // not implemented yet
  quizId;
  roomId;
  socketId;

  // Host variables
  hostListOfQuestions;
  songListTemp;

  // Game variables
  selectedQuestion;
  selectedAnswer;
  questionNum = 0;
  
  audio;
  audioCreated = false;
  volume;

  showGame = true;
  showAnswerScreen
  showScoreboardScreen
  showWinnerScreen
  showVolume = true;

  correctAnswer;
  winner

  roomData;

  showTimer = true;
  timer; 
  seconds = 11; 

  timerRunning = true;

  startDate
  timeNow
  timeRemaining: any;
  timeAnsweredIn;

  showTimeAnswered: boolean = false;

  constructor(private socketService: SocketService, private router: Router, private httpService: HttpService, private gameService: GameService) {
    try{
      this.userInStartGame = this.router.getCurrentNavigation().extras.state['userInStartGame'];
      this.isHost = this.router.getCurrentNavigation().extras.state['isHost'];
      this.nickname = this.router.getCurrentNavigation().extras.state['nickname'];
      this.quizId = this.router.getCurrentNavigation().extras.state['quizId'];
      this.roomId = this.router.getCurrentNavigation().extras.state['roomId'];
      this.socketId = this.router.getCurrentNavigation().extras.state['socketId'];
    }
    catch{
      this.router.navigate(['pin']);
    }
}

  ngOnInit(): void {
    // Set up volume
    if(!localStorage.getItem("volume")){
      console.log("no localStorage volume found")
      localStorage.setItem("volume", "0.5");
      this.volume = 0.5;
    }
    else{
      this.volume = Number(localStorage.getItem("volume"));
      localStorage.setItem("volume", String(this.volume));
      console.log("volume read as " + this.volume)
    }


    /* INIT Subscriptions for game */

    // When host gets all necessary data to start game
    this.subs.add(this.gameService.gameQuestions.subscribe(() =>{
      this.socketService.emit("sendQuestionToClients", {hostListOfQuestions: this.hostListOfQuestions[0], socketId: this.socketId}); // emits first question from host data
    }))

    // When ANY user receives a question back from the server
    this.subs.add(this.socketService.receiveCurrentQuestion().subscribe(async (res) =>{
      this.handleQuestionDelivery(res); // process all requirements for the question to function
      this.selectedAnswer = ""
      this.seconds = 10;
      this.showTimer = true;
      this.timerRunning = true;

      this.startDate = new Date;

      this.timer = timer(0, 1000).pipe(
        take(this.seconds),
        tap(() => {
          if(this.timerRunning){
            console.log(this.seconds);
            this.seconds -= 1;
            if(this.seconds < 1){
              this.gameService.deliverAnswerChosen();
              this.showTimer = false;
              this.timerRunning = false;
            }
          }
        })
      );
    }))

    // When SINGULAR user has finished choosing a question
    this.subs.add(this.gameService.answerChosen.subscribe(() =>{
      // this.timeAnsweredIn = Math.trunc(10 - this.timeRemaining);
      // Not extremely (precise) rounding but gets the job done
      // Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
      this.timeAnsweredIn = Math.trunc((10 - this.timeRemaining) * Math.pow(10, 2)) / Math.pow(10, 2);

      
      this.showTimeAnswered = true;
      this.socketService.emit("answerChosen", {answerChosen: this.selectedAnswer, socketId: this.socketId, questionId: this.selectedQuestion._id, nickname: this.nickname, timeRemaining: this.timeRemaining})
      
      // 
      this.showGame = false;
      this.showVolume = false;
      this.showScoreboardScreen = false;``
      this.timeRemaining = "";
      this.audio.pause();

    }))

    //  When all answers have been chosen by the users in the game room (res provides score data)
    this.subs.add(this.socketService.allAnswersReceived().subscribe(async (res)=>{
      console.log("time remaining: ")
      console.log(this.timeRemaining);
      this.showTimeAnswered = false;
      console.log(res)
      this.showGame = false;
      this.showVolume = false;
      this.audio.pause();
      this.correctAnswer = res['correctAnswer']
      this.roomData = res['roomData']
      this.showAnswerScreen = true;
      await this.sleep(1000)
      // Hide game but show correct answer
      this.showScoreboardScreen = true;
      await this.sleep(4000)
      // queue next question
      if(this.isHost){
        console.log(this.questionNum);
        console.log(this.hostListOfQuestions)
        console.log(this.hostListOfQuestions.length)
        this.questionNum++;
        if(this.questionNum < this.hostListOfQuestions.length){
          // trigger receiveCurrentQuestion
          this.socketService.emit("sendQuestionToClients", {hostListOfQuestions: this.hostListOfQuestions[this.questionNum], socketId: this.socketId});
          // this.gameService.handleGameQuestions();
          this.showGame = true;
          this.showVolume = true;
          this.showAnswerScreen = false;
        }
        else{
          console.log("end game - in all answer received sub")
          this.socketService.emit("triggerEndOfQuiz", this.socketId);
        }
      }
    }))

    // On end of quiz (no more questions left )
    this.subs.add(this.socketService.onQuizEnd().subscribe((res) =>{
      console.log("in onquizend")
      console.log(res);
      this.winner = res[0].nickname;
      console.log(this.winner);

      this.showGame = false;
      this.showAnswerScreen = false;
      this.showWinnerScreen = true;
      this.showVolume = false;

      // If user is host allow option to restart quiz 

    }))

    if(!this.isHost){
      // On Host Leaving or disconnecting
      this.subs.add(this.socketService.onHostLeaving().subscribe((res) =>{
        alert("host has left the game");
        // sorry host has left the game thingy + redirect.. otherwise, must do destructuring and pop up
        
      }))

    }


    // // On play again??
    // this.subs.add(() =>{

    // })




    if(this.isHost){ /* If user is the host, get the required quiz data */
      this.subs.add(this.httpService.get("getQuizQuestionsWithoutAnswer", this.quizId)
      .subscribe((res) =>{
        this.hostListOfQuestions = res;
        this.gameService.handleGameQuestions();
      }))
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleQuestionDelivery(hostListOfQuestions){
    // Reset selectedAnswer
    this.selectedAnswer = "";

    // Show components
    this.showGame = true;
    this.showVolume = true;

    // Handle audio functionality
    this.audio = new Audio(hostListOfQuestions.songId.audioFile)
    this.audioCreated = true;
    this.audio.volume = Number(this.volume); 
    this.audio.play();
    console.log(this.audio.volume);

    // Set the game question
    this.selectedQuestion = hostListOfQuestions;

  }

  getSelectedAnswer(getSelectedAnswer){
    console.log(getSelectedAnswer);
    this.selectedAnswer = getSelectedAnswer;
    // clearInterval(this.timer);
    this.showTimer = false;
    this.timerRunning = false;
    this.timeNow = new Date();
    this.timeRemaining = (10 - (Math.abs(this.startDate - this.timeNow) / 1000));
    console.log(this.timeRemaining);
    this.gameService.deliverAnswerChosen();
  }

  updateVolume($event){
  let volume = $event
  if(this.audioCreated){
    localStorage.setItem("volume", String(volume));
    this.volume = volume;
    this.audio.volume = volume;
  }
  }

  ngOnDestroy(){
    // If audio exists when leaving the page, pause.
    if(this.audioCreated){
      this.audio.pause();
    }

    // All actions necessary if user is leaving the game
    if(this.userInStartGame){
      if(this.isHost){ // If user is Host
  
        // Emit to backend socket that host is leaving (alerts all listening sockets and deletes room from backend Map)
          this.socketService.emit("hostLeaving", {socketId: this.socketId})
  
        // delete the room from DB
        this.httpService.delete('deleteRoom', this.roomId).pipe(take(1)).subscribe(() => {
        })

        this.socketService.disconnect(); // disconnect from all socket listeners
        this.subs.unsubscribe() // unsubscribe from all rxjs listeners
      }
      else{
        this.socketService.disconnect(); // disconnect from all socket listeners
        this.subs.unsubscribe() // unsubscribe from all rxjs listeners
      }
    }
    
  }

}
