import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-game-nickname-score',
  templateUrl: './game-nickname-score.component.html',
  styleUrls: ['./game-nickname-score.component.css']
})
export class GameNicknameScoreComponent implements OnInit {

  @Input() userData

  constructor() { }

  ngOnInit(): void {
  }

}
