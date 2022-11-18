import { Component, OnInit, ViewChild} from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-game-pin',
  templateUrl: './game-pin.component.html',
  styleUrls: ['./game-pin.component.css']
})
export class GamePinComponent implements OnInit {

  @ViewChild('f') pinForm: NgForm;

  constructor(private gameService: GameService, private httpService: HttpService, private router: Router) { }

  ngOnInit(): void {
  }

  onPinSubmit(){
    if(this.pinForm.valid == true){
      this.httpService.get('getRoom', this.pinForm.value.pin).pipe(take(1)).subscribe((res) => {
        console.log(res);
        this.gameService.pinToNickname(res);
        this.router.navigate(['nickname']); // navigate to nickname
      }, error => {
        console.log(error)
        alert('bad pin')
      })
    }
  }

}
