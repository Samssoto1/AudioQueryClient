import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from './http.service';
import { Subject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenTimer: NodeJS.Timer;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  serverResponseMsg = new Subject<string>();
  private isAuth = false;
  private userId: string;
  private username: string;

  isError = new EventEmitter();

  

  constructor(private httpService: HttpService, private router: Router) { }

  createUser(object: any){ // Create a user - Register
    this.httpService.post("registration", object).pipe(take(1)).subscribe((res) => {
      this.serverResponseMsg.next(res['serverResponseMsg']) // pass subject containing error msg to the login component to notify the user
    });
  }

  loginUser(object: any){ // Login a user - Login
    this.httpService.post("login", object).pipe(take(1)).subscribe((data) => {
      console.log(data);
      if (data['success'] == true) { // If response says login data was successful
        this.token = data['token']
        this.userId = data['user']['id'];
        this.username = data['user']['username'];
        const expiresInDuration = data['expiresIn'];
        this.setAuthTimer(expiresInDuration);
        this.isAuth = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        ); // miliseconds again
        this.saveAuthData(this.token, expirationDate, this.userId, this.username);
        const username = localStorage.getItem('username');
    
            this.router.navigate(['/profile', username ]);
            this.serverResponseMsg.next(data['serverResponseMsg']) // pass subject containing error msg to the login component to notify the user

      } 
      else{
      this.serverResponseMsg.next(data['serverResponseMsg']) // pass subject containing error msg to the login component to notify the user
      }
    }); 
  }

  getId(){
    this.userId = localStorage.getItem('userId')
    return this.userId;
  }

  getUsername(){ // for "My account button"
    this.username = localStorage.getItem('username')
    return this.username;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    localStorage.clear();
    this.router.navigate(['']);
    // this.router.navigate(['login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      localStorage.clear();
    }, duration * 1000); // setTimeout works with miliseconds. Multiplying seconds by *1000 for mili..
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    console.log(expirationDate);
    console.log(expirationDate.toISOString);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn =
      authInformation['expirationDate'].getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation['token'];
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000); // works in seconds so we divide the miliseconds by 1000 to get seconds
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return '';
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

}
