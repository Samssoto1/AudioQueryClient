import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  @Output() setBgColor = new EventEmitter();
  @ViewChild('asdf') test; 

  constructor(private appService: AppService, private router: Router) { 
  }

  ngOnInit(): void {

    // let spline = new Application(this.test);
    // spline.load('https://prod.spline.design/MJULiB7Y2cdgKvzL/scene.splinecode');


    this.appService.updateBackgroundColor("#292b2c");
    }

  ngOnDestroy(){
    this.appService.updateBackgroundColor("");
  }

  directToPin(){
    this.router.navigate(["/pin"])
  }

}
