import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // selectedQuizId = new ReplaySubject<string>();
  selectedQuizId = new BehaviorSubject<string>(undefined);

  updateQList = new Subject<boolean>();

  questionClicked = new Subject();
  questionToDelete = new Subject();

  previousQuestion = new Subject();
  
  changes = new Subject();

  constructor() { }

  // Quiz Dashboard

  getPreviousQuestion(previousQuestion){
    this.previousQuestion.next(previousQuestion);
  }

  onQuestionClicked(question){
    this.questionClicked.next(question);
  }

  passQuestionToDelete(question){
    this.questionToDelete.next(question);
  }
  
  sendChanges(changes){
    this.changes.next(changes)
  }

  // ??? Game ??? idk

  updateQuizList(quizId){
    // theres really no need for quizId but I need to send something to use next and subscribe...
    this.updateQList.next(quizId);
  }

  getSelectedQuizId(quizId){
    console.log(quizId);
    this.selectedQuizId.next(quizId);
  }

}
