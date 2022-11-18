import { Component, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-createQuiz',
  templateUrl: './createQuiz.component.html',
  styleUrls: ['./createQuiz.component.css']
})
export class CreateQuizComponent{
  @ViewChild('f') createQuizForm: NgForm;

  descChars: string; // used to count length of description characters

  constructor(private httpService: HttpService, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  onCreateQuizSubmit(){
    if(this.createQuizForm.valid){
      const author = this.authService.getUsername(); // Get username from token - localStorage
      
      const authorId = this.authService.getId(); // Get user ID from token - localStorage

      const title = this.createQuizForm.value.quizTitle

      const description = this.createQuizForm.value.quizDescription;

      // create a new quiz object
      this.httpService.post('create-a-quiz', {
        title: title,
        description: description,
        author: author,
        authorId: authorId
      }
      ).pipe(take(1)).subscribe(
        (data) => {
          console.log(data);
          // this.router.navigate(["/quiz/create-a-quiz-question", data['_id']], { relativeTo: this.activatedRoute })
          this.router.navigate(["/quiz/questionSuite", data['_id']], { relativeTo: this.activatedRoute })
        }
      );
    }
  }
}
