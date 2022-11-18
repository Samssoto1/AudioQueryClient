import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QuizDashboardService {

  constructor() { }

  saveStatus = new Subject();

  save = new Subject();

  listOrder = new BehaviorSubject(-1);

  setSave(){
    this.saveStatus.next("");
  }

  // triggered when pressing save button
  onSave(){
    this.save.next("")
  }

  checkIfListOrderHasChanged(data){
    this.listOrder.next(data)
  }
}
