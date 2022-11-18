import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription, concatMap, tap, Observable, debounceTime, take } from 'rxjs';
import { v4 as uuid } from 'uuid'; // used for generating random client Ids

// Models
import { dashInfo } from '../../model/dashInfo.model';

// Services
import { QuizService } from 'src/app/services/quiz.service';
import { SongService } from 'src/app/services/song.service';
import { QuizDashboardService } from 'src/app/services/quiz-dashboard.service';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']
})

export class QuizDashboardComponent implements OnInit, OnDestroy {
  private subs = new Subscription(); // group of subscriptions

  quizId: string;
  quizTitle: string;
  songData;


  dashInfo: dashInfo;
  questionInfo
  previousQuestionInfo;
  obs$: Observable<any>;

  questionsCreated = [];
  questionsEdited = [];
  questionsDeleted = [];
  questionInfoMapDb;

  isValidQuiz: boolean;

  selectedQuestion;
  @Input() previousQuestion;

  existsInEditAray: boolean = false;

  // Make this a variable later
  // [{ answers: [], correctAnswer: "", questionTitle: "", quizId: this.quizId, songId: "" }]

  showFiller: boolean = false; // Toggles question list nav bar
  saveAvaliable: boolean = false;

  constructor(private quizDashboardService: QuizDashboardService, private songService: SongService, private quizService: QuizService, private questionService: QuestionService, public dialog: MatDialog, private httpService: HttpService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.questionInfoMapDb = new Map(); // Init a new Map (used in the save button)
    
    // Listen for calls from other components for allowance of save feature button
    this.subs.add(this.quizDashboardService.save.subscribe(() => {this.saveAvaliable = true}))

    // Subscription for necessary data upon init
    this.subs.add(this.activatedRoute.paramMap.pipe( // get quizId from parameters
      tap(res => this.quizId = res['params']['quizId']),
      concatMap(res => this.httpService.get('getQuizById', this.quizId)),
      tap(res => {this.quizTitle = res['title']; this.isValidQuiz = res['isValid']}),
      concatMap(res => this.httpService.get('quizQuestions', this.quizId)),
      tap(res => {
        console.log(res);
        this.questionInfo = res;
        this.questionInfo = this.questionInfo.sort((a, b) => a.location > b.location ? 1 : a.location < b.location ? -1 : 0)
        this.previousQuestionInfo = JSON.parse(JSON.stringify(this.questionInfo)) // set previousQuestionInfo to this.questionInfo by VALUE not ref
        this.selectedQuestion = this.questionInfo[0]
        this.previousQuestion = this.questionInfo[0]
      })
    ).subscribe(res => {
    }
    )
    )

    // INPUT EVENT LISTENER
    this.subs.add(this.quizService.changes.pipe(debounceTime(500)).subscribe((res) => {
      console.log("data response from being edited")
      console.log(this.previousQuestionInfo)
      console.log(this.questionInfo)
      console.log(res);

      let foundId = false;
      let i = 0;

      while(!foundId){
        console.log(this.questionInfo[i])
        console.log(res['body']['correctAnswer'])
        if(this.questionInfo[i]['_id'] == res['_id'] && res['_id'] != undefined){
          console.log('update _id')
          this.questionInfo[i]['question'] = res['body']['question']
          this.questionInfo[i]['answers'] = res['body']['answers'];
          this.questionInfo[i]['correctAnswer'] = res['body']['correctAnswer'];
          this.questionInfo[i]['isValid'] = res['body']['isValid']
          this.questionInfo[i]['location'] = res['body']['location'];
          this.questionInfo[i]['questionTitle'] = res['body']['questionTitle'];
          this.questionInfo[i]['songId'] = res['body']['songId'];
          foundId = true;
        }

        if(this.questionInfo[i]['clientId'] == res['clientId'] && res['clientId'] != undefined){
          console.log('update clientId')
          this.questionInfo[i]['question'] = res['body']['question']
          this.questionInfo[i]['answers'] = res['body']['answers'];
          this.questionInfo[i]['correctAnswer'] = res['body']['correctAnswer'];
          this.questionInfo[i]['isValid'] = res['body']['isValid']
          this.questionInfo[i]['location'] = res['body']['location'];
          this.questionInfo[i]['questionTitle'] = res['body']['questionTitle'];
          this.questionInfo[i]['songId'] = res['body']['songId'];
          foundId = true;
        }

        i+=1
      }

      // allow save button functionallity
      this.saveAvaliable = true;

      this.existsInEditAray = false;

      console.log("question info ")
      console.log(this.questionInfo);
    }))



    // Get all songs
    this.subs.add(this.httpService.get("getAllSongs", "").subscribe((res) => {
      this.songData = res;

      // Sort songs alphabetically
      this.songData.sort((a, b) =>
        a.artist > b.artist ? 1 : a.artist < b.artist ? -1 : 0
      );

      // Pass song list to observable in song list component
      this.songService.passSonglist(this.songData);
    }
    ))

    this.subs.add(this.quizService.questionClicked.subscribe((res) => 
    {
      // change the selected question to the response from questionClicked subscription
      this.selectedQuestion = res;
    }))

    // Question to delete
    this.subs.add(this.quizService.questionToDelete.subscribe((res) => {
      console.log("deleting")

      let previousQuestionIndex = 0

      // Delete client generated question from "questionInfo" array
      if (res['clientId']) {
        console.log("deleting a new question")
        this.questionInfo.forEach((question, i) => {
          if (question['clientId'] == res['clientId']) {
            this.questionInfo.splice(i, 1);
            previousQuestionIndex = i
          }
        })

        // Delete client generated question from "questionsEdited" array
        this.questionsEdited.forEach((question, i) =>{
          if (question['clientId'] == res['clientId']) {
            this.questionsEdited.splice(i, 1);
          }
        })
        this.saveAvaliable = true;
        // return
      }
      if(res['_id']){
        
        this.questionsDeleted.push(res['_id']);

        // Delete db generated question from "questionInfo" array
      this.questionInfo.forEach((question, i) => {
        if (question['_id'] == res['_id']) {
          this.questionInfo.splice(i, 1);
          previousQuestionIndex = i
        }
      })
      }

      // Only reach here if planning to delete a db generated question
      console.log("deleting a db question")
      console.log(previousQuestionIndex)

      if(previousQuestionIndex > 0){
        this.selectedQuestion = this.questionInfo[previousQuestionIndex - 1]
      }
      else{
        this.selectedQuestion = this.questionInfo[0]
      }

      this.saveAvaliable = true;

      
      /*
      // Delete db generated question from "questionsEdited" array
      this.questionsEdited.forEach((question, i) => {
        console.log('here')
        console.log(question['_id'])
        console.log(res['_id'])
        if (question['_id'] == res['_id']) {
          console.log("deleting " + question['_id'])
          this.questionsEdited.splice(i, 1);
        }
      })
      */

    }))
  }

  updateSave() {
    this.saveAvaliable = true;
  }

  newQuestion(quizId: string) {
    console.log(this.questionInfo);
    console.log(this.previousQuestionInfo);
    let clientId = uuid()
    this.questionInfo.push({ answers: [], correctAnswer: "", quizId: this.quizId, questionTitle: "", location: this.questionInfo.length, songId: "", clientId: clientId, isValid: false })
    this.saveAvaliable = true;
    console.log(this.questionInfo);
    console.log(this.previousQuestionInfo);
    // this.selectedQuestion = this.questionInfo[this.questionInfo];
    this.selectedQuestion = this.questionInfo[this.questionInfo.length - 1];
  }

  save() {
    if (this.saveAvaliable == true) {
      this.quizDashboardService.onSave();

      this.subs.add(this.quizDashboardService.listOrder.pipe(take(1),
      tap((res) => {
        console.log(res);


        // if id is found & is clientId then push to create array, if found & is _id (check values for changes.. if changed then push to edit array)
        // If previous id is not found in new question then previous id should be pushed to delete []  
        // if all questions are valid (boolean) then push isValid to db (quiz schema)

        // this.questionInfoMap = new Map();
        


        // Make two maps. one for client generated questions, and one for db generated questions
        this.questionInfo.forEach((question) =>{
          if(question['_id']!= undefined){

            this.questionInfoMapDb.set(question['_id'], question)
            console.log("questionMap")
            console.log(this.questionInfoMapDb)
          }
          if(question['clientId'] != undefined){
            // IF ITEM HAS CLIENTID THEN PUSH TO CREATE ARRAY
            this.questionsCreated.push(question);
          }
        })

        console.log("questionInfo")
        console.log(this.questionInfo)

        console.log("previousQuestionInfo")
        console.log(this.previousQuestionInfo)

        // Check for every property of object for changes... if theres changes to any of them push to edit array
        // if(previousQuestion['answers'] != questionInfoMapDb.get(previousQuestion['_id']).answers){ // check answers
        // if(this.previousQuestionInfo.length > this.questionInfo.length){
          this.previousQuestionInfo.forEach((previousQuestion) =>{


            if(this.questionInfoMapDb.has(previousQuestion['_id']))
            {
              // convert this to normal comparison between two arrays later (comparing json strings prob not the best way..)
              if(previousQuestion['question'] != this.questionInfoMapDb.get(previousQuestion['_id']).question){ // check correctAnswer
                console.log('question IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {
                question: this.questionInfoMapDb.get(previousQuestion['_id']).question,
                answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }

              if(JSON.stringify(previousQuestion['answers']) != JSON.stringify(this.questionInfoMapDb.get(previousQuestion['_id']).answers)){ // check answers
                console.log('ANSWERS IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
              if(previousQuestion['correctAnswer'] != this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer){ // check correctAnswer
                console.log('CORRECT ANSWERS IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
              if(previousQuestion['isValid'] != this.questionInfoMapDb.get(previousQuestion['_id']).isValid){ // check isValid
                console.log('isValid IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
              if(previousQuestion['location'] != this.questionInfoMapDb.get(previousQuestion['_id']).location){ // check location
                console.log('LOCATION IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
              if(previousQuestion['questionTitle'] != this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle){ // check questionTitle
                console.log('CORRECT ANSWERS IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
              if(previousQuestion['songId'] != this.questionInfoMapDb.get(previousQuestion['_id']).songId){ // check songId
                console.log('SONGID IS DIFF')
                this.questionsEdited.push({_id: this.questionInfoMapDb.get(previousQuestion['_id'])._id, body: {answers: this.questionInfoMapDb.get(previousQuestion['_id']).answers,
                correctAnswer: this.questionInfoMapDb.get(previousQuestion['_id']).correctAnswer,
                isValid: this.questionInfoMapDb.get(previousQuestion['_id']).isValid,
                location: this.questionInfoMapDb.get(previousQuestion['_id']).location,
                questionTitle: this.questionInfoMapDb.get(previousQuestion['_id']).questionTitle,
                songId: this.questionInfoMapDb.get(previousQuestion['_id']).songId}})
                return
              }
            } 
            // else{ // Push to delete
            //   this.questionsDeleted.push(previousQuestion['_id
            // }         
          })
        // }


        console.log("Report:\n")
        // Report of whats to occur
        console.log("questionInfo")
        console.log(this.questionInfo)
        console.log("previous questionInfo")
        console.log(this.previousQuestionInfo)

        console.log("Questions created")
        console.log(this.questionsCreated)
        console.log("Questions deleted")
        console.log(this.questionsDeleted)
        console.log("Questions edited")
        // console.log(this.questionsEdited.slice())
        console.log(this.questionsEdited.slice())
        console.log("isValidQuiz")
        console.log(this.isValidQuiz);

        // Make calls


      }),
      concatMap(res => this.httpService.batch("saveQuizQuestions", {create: this.questionsCreated, edit: this.questionsEdited, delete: this.questionsDeleted})),
      
      // tap(res => {this.quizTitle = res['title']; this.isValidQuiz = res['isValid']}
      
      tap(res => {        // Resets values
        this.questionsCreated.length = 0;
        this.questionsDeleted.length = 0;
        this.questionsEdited.length = 0;

        this.questionInfoMapDb.clear();
        this.saveAvaliable = false;})
      ).subscribe(() =>{
        this.httpService.get('quizQuestions', this.quizId).pipe(take(1)).subscribe((res)=>{
          console.log(res);
          this.questionInfo = res
          this.questionInfo = this.questionInfo.sort((a, b) => a.location > b.location ? 1 : a.location < b.location ? -1 : 0)
          // this.previousQuestionInfo = this.questionInfo.slice();
          this.previousQuestionInfo = JSON.parse(JSON.stringify(this.questionInfo))
          console.log("previous question info")
          console.log(this.previousQuestionInfo)
          console.log("question info")
          console.log(this.questionInfo)
          console.log('\n')
          console.log('\n')
          console.log('\n')

        })
      }))
    }
  }



  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}


