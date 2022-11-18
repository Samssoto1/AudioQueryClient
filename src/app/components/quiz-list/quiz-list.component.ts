import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { QuizService } from 'src/app/services/quiz.service';


@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  @Input() list_of_quizzes;
  @Input() userId;
  subscription: Subscription;
  // isLoading;

  constructor(private router: Router, private httpService: HttpService, private quizService: QuizService) { }

  ngOnInit(): void {
    
    // Subscription used to update if quiz is getting deleted
    this.subscription = this.quizService.updateQList.subscribe( (result) => {
      console.log(result);
      this.getQuizList();
    });
    
    // Inital load in to get quiz list on profile page
    this.getQuizList()

  }

  getQuizList(){
    this.httpService.get("quizzesForUser", this.userId).subscribe((data) => {
      console.log(data);
      this.list_of_quizzes = data;
    });
  }

  createAQuiz(){
    this.router.navigate(['/quiz/createQuiz'])
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
