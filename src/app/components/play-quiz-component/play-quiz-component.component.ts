import { Component, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-play-quiz-component',
  templateUrl: './play-quiz-component.html',
  styleUrls: ['./play-quiz-component.css']
})
export class PlayQuizComponent implements OnInit {

  canPlay: boolean;

  constructor(private matDialogRef: MatDialogRef<PlayQuizComponent>) { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.matDialogRef.close(this.canPlay);
  }

}
