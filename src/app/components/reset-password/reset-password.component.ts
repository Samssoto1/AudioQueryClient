import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private httpService: HttpService) {}
  tokenValid: boolean = false;
  @ViewChild('f') resetPasswordForm: NgForm;
  public showPassword: boolean = false;
  errorMsg: string;
  paramUserId: string;
  localStoragePasswordToken: string;
  successMsg: string;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( (params: ParamMap) => {
      this.paramUserId = params['params']['userId'];
      const token = params['params']['tokenId'];
      // check to see if resettoken exists in local storage
      this.localStoragePasswordToken = localStorage.getItem('resetPasswordToken');
      if(this.localStoragePasswordToken == undefined){
        this.tokenValid = false;
        this.errorMsg = "Your password reset window has expired.. please try again"
        return
      }
      //check to see if token is expired ()
      if(token == this.localStoragePasswordToken){
        this.tokenValid = true;
      }
    })


    // if not, load page content and allow user to submit form
  }

  onSubmit(){
    this.errorMsg = undefined
    this.successMsg = undefined

    if(this.localStoragePasswordToken == undefined){
      this.tokenValid = false;
      this.errorMsg = "Your password reset window has expired.. please try again"
      return
    }

    if(this.tokenValid == true && this.resetPasswordForm.valid == true){
      this.httpService.post('resetPassword', {userId: this.paramUserId, password: this.resetPasswordForm.value.password, resetPasswordToken: this.localStoragePasswordToken }).subscribe( (res) => {
        if(res['standing'] == 'valid'){
          this.successMsg = res['message'];
          localStorage.setItem('resetPasswordToken', res['token']);
        }
      })
    }
  }

  toggleShow(){
    this.showPassword = !this.showPassword;
  }

}
