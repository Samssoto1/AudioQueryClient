import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  username: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe( (isAuthenticated) =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  goToAccount(){
    this.username = this.authService.getUsername();
    console.log(this.username);
    // this.router.navigate(['/profile', this.userId]);
    this.router.navigate(['/profile', this.username]);

  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
    console.log('logging out')
  }

  createAQuiz(){
    this.router.navigate(['/quiz/createQuiz']);
  }

}
