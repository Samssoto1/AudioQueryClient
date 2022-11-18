import { Component, ViewChild, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') signupForm: NgForm;
  public showPassword: boolean = false;

  hideServerResponseMsg: boolean = false;
  // serverResponseSub: Subscription;
  serverResponseMsg: string;

  constructor(private authService: AuthService, private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
  }

  
  onRegisterSubmit(){
    if(this.signupForm.valid && this.signupForm.value.password == this.signupForm.value.passwordConfirmation){
      this.authService.createUser({
        username: this.signupForm.value.username,
        email: (this.signupForm.value.email).toLowerCase(),
        password: this.signupForm.value.password
      });
      this.signupForm.form.markAsPristine()
      this.signupForm.form.updateValueAndValidity()
      this.hideServerResponseMsg = true;

      this.authService.serverResponseMsg.pipe(
        take(1)
      ).subscribe((serverResponseMsg) => {
        if(serverResponseMsg != undefined){
          this.hideServerResponseMsg = false;
          this.serverResponseMsg = serverResponseMsg;
        }
        else{
          this.hideServerResponseMsg = true;
          this.router.navigate(['/login']);
        }
      })


    }
  }


  public toggleShow(): void {
    console.log('in here')
    this.showPassword = !this.showPassword;
  }

}
