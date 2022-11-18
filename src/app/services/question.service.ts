import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  updateQList = new Subject();

  updateQListObs = new Observable;

  constructor() { }

  updateQuestionList(questionId: string){
    // Not using sent questionId.. just refreshing list
    this.updateQList.next(questionId);
  }
}
