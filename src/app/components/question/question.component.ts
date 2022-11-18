import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import {MatDialog} from '@angular/material/dialog';
import { DeleteComponent } from '../dialog/delete/delete.component';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private httpService: HttpService, public dialog: MatDialog, private router: Router, private questionService: QuestionService, private quizService: QuizService) { }
  @Input() question;

  ngOnInit(): void {
    
  }

  onDelete(questionId: string){
    // confirm delete
    let dialogRef = this.dialog.open(DeleteComponent, {data: {type: "question"}});
    dialogRef.afterClosed().subscribe(
      result => {
        // result tells us whether the user selected yes or no
        // if result = true, delete quiz from db
        if(result){
          // delete quiz
          console.log(this.question);
          // this.httpService.delete("quizQuestion", questionId).subscribe( res => {

          // })

        this.quizService.passQuestionToDelete(this.question);
        }
      }
      )
  }

  onEdit(){
    console.log(this.question);
    this.quizService.onQuestionClicked(this.question);
  }

}
