import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from 'src/app/services/song.service';
import { Observable, Subscription} from 'rxjs';
import { QuizService } from 'src/app/services/quiz.service';
import { QuizDashboardService } from 'src/app/services/quiz-dashboard.service';

@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.css']
})
export class QuestionCreator implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) createAQuizQuestionForm: NgForm;
  quizId: string;
  questionId: string;
  list_of_songs;
  selectedSongData
  answerOne
  answerTwo
  answerThree
  answerFour
  correctAnswerText
  songId
  songTitle
  correctAnswer

  isValid: boolean

  @Input() selectedQuestion

  @Output() previousQuestion = new EventEmitter();

  updateSelectedQuestionTitle$: Observable<any>;

  private subs = new Subscription();

  constructor(private quizDashboardService: QuizDashboardService, private songService: SongService, private quizService: QuizService, private httpService: HttpService, private authService: AuthService, private router: Router,private activatedRoute: ActivatedRoute )
  {

  }

  getQuestion(question){
    console.log(question);
    this.selectedQuestion['question'] = question;
  }

  ngOnInit(): void {

    this.subs.add(this.songService.selectedSong.subscribe((res) =>{
      console.log(res)
      this.selectedQuestion['question'] = res['question'];
      this.selectedQuestion['songId'] = res['_id'];
      this.selectedQuestion['questionTitle'] = res['title']
      this.selectedQuestion['artist'] = res['artist']
      
      // tell dashboard that save is avail
      this.quizDashboardService.onSave();
    }))
  }


  onChange(data){
    console.log(this.createAQuizQuestionForm.valid)
    // If meets validation.. change isValid to true
    if(this.createAQuizQuestionForm.valid && this.selectedQuestion?.songId != ""){
      this.isValid = true;
    }
    else{
      this.isValid = false;
    }

    // If has _id... then it's a question already saved in our database
    if(this.selectedQuestion._id != undefined){
      this.quizService.changes.next({_id: this.selectedQuestion._id, 
        body: 
          {
          question: this.selectedQuestion.question,
          answers: [this.createAQuizQuestionForm.value.answerOne, this.createAQuizQuestionForm.value.answerTwo, this.createAQuizQuestionForm.value.answerThree, this.createAQuizQuestionForm.value.answerFour],
          correctAnswer: this.createAQuizQuestionForm.value.correctAnswer,
          location: this.selectedQuestion.location,
          questionTitle: this.selectedQuestion.questionTitle,
          quizId: this.selectedQuestion.quizId,
          songId: this.selectedQuestion['songId'],
          isValid: this.isValid}});
    }

    // else... has clientId instead of _id
    else{
      this.quizService.changes.next({clientId: this.selectedQuestion.clientId, 
        body: 
          {
          question: this.selectedQuestion.question,
          answers: [this.createAQuizQuestionForm.value.answerOne, this.createAQuizQuestionForm.value.answerTwo, this.createAQuizQuestionForm.value.answerThree, this.createAQuizQuestionForm.value.answerFour],
          correctAnswer: this.createAQuizQuestionForm.value.correctAnswer,
          location: this.selectedQuestion.location,
          questionTitle: this.selectedQuestion.questionTitle,
          quizId: this.selectedQuestion.quizId,
          songId: this.selectedQuestion['songId'],
          isValid: this.isValid}});
    }
  }

  ngOnDestroy(){
    this.subs.unsubscribe(); // unsubscribe from all subscriptions
  }

}
