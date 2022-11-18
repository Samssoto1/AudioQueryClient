import { Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { QuizDashboardService } from 'src/app/services/quiz-dashboard.service';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnDestroy{

  @Input() questionInfo;
  @Input() quizId;

  selectedIndex;

  listNeedsUpdate: boolean = false;

  subscription: Subscription;

  @Output() saveAvailable = new EventEmitter;

  constructor(private quizDashboardService: QuizDashboardService) { }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.saveAvailable.emit("");
      this.listNeedsUpdate = true;
    }
  }

  public setRow(_index: number) {
    this.selectedIndex = _index;
  }

  ngOnInit(): void {
    console.log("qlist init")
    this.subscription = this.quizDashboardService.save.subscribe(() => {
      console.log("triggered save in qlist")
      console.log(this.questionInfo);
      this.questionInfo.forEach((question, i) => {
        question.location = i
      });
      // console.log("questions re-indexed")
      // Pass back if listNeedsUpdate, along with questionList
      this.quizDashboardService.checkIfListOrderHasChanged({listNeedsUpdate: this.listNeedsUpdate, list: this.questionInfo})
      console.log("passed to quizDashboard from qlist")
      console.log(this.questionInfo)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
