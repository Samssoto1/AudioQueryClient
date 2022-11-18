import { Component, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Subscription, concatMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string;
  username: string;
  registrationDate;
  isLoading: boolean = false;
  list_of_quizzes: any;
  // imgUrl: string = "https://www.listchallenges.com/f/lists/57789dce-7a91-4176-9733-cdfdc7d6d350.jpg"
  imgUrl: string = "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
  isGuest: boolean;
  level: Number;
  subscription: Subscription;
  panelOpenState = false;

  constructor(private httpService: HttpService, private activatedRoute: ActivatedRoute, private router: Router ) {}

  // ngOnInit(){
  //   this.subscription = this.activatedRoute.paramMap.pipe(
  //     concatMap(res => this.httpService.get('profile', this.username))

  //   ).subscribe()
  // }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.username = params['params']['username'];

      this.httpService.get('profile', this.username).subscribe((data) => {
          this.isLoading = false;
          this.userId = data[0]['_id']
          this.username = data[0]['username'];
          this.registrationDate = data[0]['registrationDate'];
          this.level = data[0]['level']

          // if username in token matches username in url then show quizzes... is this secure??? (Doesn't feel like it) 
          try{
            const username = localStorage.getItem('username');
          
            if(this.username == username){
              console.log("Is not a guest")
              console.log(this.userId);
              this.isGuest = false;
              
              // set bool to true which allows quiz-list to be loaded

            }
          }
          catch{
            this.isGuest = true;
          }
        });
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
