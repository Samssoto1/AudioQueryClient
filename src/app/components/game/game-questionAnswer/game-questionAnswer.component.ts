import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-questionAnswer',
  templateUrl: './game-questionAnswer.component.html',
  styleUrls: ['./game-questionAnswer.component.css']
})
export class GameQuestionAnswerComponent implements OnInit {

@Input() answer: string;

  constructor() { }

  ngOnInit(): void {
  }
}
