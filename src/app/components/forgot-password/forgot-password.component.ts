import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('f') forgotPasswordForm: NgForm;
  errorMsg;
  successMsg;

  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
  }

  onFormSubmit(){
    if(this.forgotPasswordForm.valid){
      // Reset Msgs
      this.errorMsg = undefined
      this.successMsg = undefined


      this.httpService.post('forgotPassword', {email: (this.forgotPasswordForm.value.email.toLowerCase())}).subscribe((res) => {
        console.log(res['standing'])
        if(res['standing'] == 'valid'){
          this.successMsg = res['message'];
          localStorage.setItem('resetPasswordToken', res['token']);
        }
        // if(res['standing'] == 'error'){
        // }
      }, error => {
        console.log(error)
        this.errorMsg = error['error']['message'];
        
      });
  }
}

}
