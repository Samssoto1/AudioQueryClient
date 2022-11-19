import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class HttpService {
  // Dev
  // api: string = 'http://localhost:8000';
  // Deploy
  api = environment.api;
  
  private tokenTimer: NodeJS.Timer;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  
  constructor(private http: HttpClient, private router: Router) {}
  
  // Handle Batch Routes
  batch(route: string, object: any){
    switch (route){
      case 'saveQuizQuestions':{
        return this.http.post(`${this.api}/api/questions/saveQuizQuestions`, object);
      }
    }
  }

  // Handle Get Routes
  get(route: string, object: any) {
    switch (route) {
      case 'admin': {
        this.http.get(`${this.api}/admin`, object).subscribe((data) => {
          console.log('here');
        });
        break;
      }
      case 'profile':{
        return this.http.get(`${this.api}/api/users/singleuserByUsername/${object}`);
      }
      case 'quizzesForUser' : {
        return this.http.get(`${this.api}/api/quiz/quizzesForUser/${object}`);
      }
      case 'quizQuestions': {
        return this.http.get(`${this.api}/api/quiz/getQuizQuestions/${object}`);
      }
      case 'getQuestionById': {
        return this.http.get(`${this.api}/api/quiz/getQuestionById/${object}`);
      }
      case 'getQuizById': {
        return this.http.get(`${this.api}/api/quiz/getQuizById/${object}`);
      }
      case 'getAllSongs': {
        return this.http.get(`${this.api}/api/songs/getAll`);
      }
      case 'getSongById': {
        return this.http.get(`${this.api}/api/quiz/getSongById/${object}`);
      }
      case 'getRoom': {
        return this.http.get(`${this.api}/api/rooms/getRoom/${object}`);
      }
      case 'getQuizQuestionsWithoutAnswer': {
        return this.http.get(`${this.api}/api/questions/getQuizQuestionsWithoutAnswer/${object}`);
      }
      case 'getNicknamesInRoom': {
        return this.http.get(`${this.api}/getNicknamesInRoom`, {params: new HttpParams().set('socketId', object.socketId).set('nickname', object.nickname)});
      }

      default:
        {
          break;
        }
    }
  }

  // Handle Put Routes
  put(route: string, object: any){
    switch (route) {
      case 'updateQuestionByQuestionId': {
        return this.http.put(`${this.api}/api/quiz/updateQuestionByQuestionId`, object);
      }
      case 'editRoomUserList': {
        return this.http.put(`${this.api}/api/rooms/editRoomUserList`, object);
      }
      default:
      {
        break;
      }
    }
  }

  // Handle Post Routes
  post(route: string, object: any) {
    // used for all post routes
    switch (route) {
      case 'registration': {
        return this.http.post(`${this.api}/api/users/createuser`, object);
      }
      case 'login': {
        return this.http.post(`${this.api}/api/users/login`, object)
        }
      case 'create-a-quiz': {
        return this.http.post(`${this.api}/api/quiz/create-a-quiz`, object)
      }
      case 'createQuestion': {
        return this.http.post(`${this.api}/api/questions/createQuestion`, object)
      }
      case 'adminSongUpload': {
        return this.http.post(`${this.api}/api/quiz/songUpload`, object)
      }
      case 'forgotPassword': {
        return this.http.post(`${this.api}/api/users/forgotPassword`, object);
      }
      case 'resetPassword': {
        return this.http.post(`${this.api}/api/users/resetPassword`, object);
      }
      case 'createRoom': {
        return this.http.post(`${this.api}/api/rooms/createRoom`, object);
      }
      case 'createManyQuestions': {
        return this.http.post(`${this.api}/api/questions/createManyQuestions`, object);
      }
      default:
        {
          break;
        }
    }
  }

  // Handle Delete Routes
  delete(route, object){
    switch (route) {
      case "quiz": {
        return this.http.delete(`${this.api}/api/quiz/delete/${object}`);
      }
      case "quizQuestion":{
        return this.http.delete(`${this.api}/api/quiz/deleteQuestion/${object}`);
      }
      case "allQuizQuestions":{
        return this.http.delete(`${this.api}/api/quiz/deleteAllQuizQuestions/${object}`);
      }
      case 'deleteRoom': {
        return this.http.delete(`${this.api}/api/rooms/deleteRoom/${object}`);
      }
      default:
        {
          break;
        }
    }
  }
  
  getToken() {
    return this.token;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}
