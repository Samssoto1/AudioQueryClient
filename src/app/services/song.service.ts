import { Injectable } from '@angular/core';
import { Subject, ReplaySubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor() { }

  songList = new ReplaySubject(1);
  selectedSong = new Subject();


  passSonglist(songList){
    this.songList.next(songList);
  }

  passSelectedSong(selectedSong){
    console.log('here')
    console.log(selectedSong)
    this.selectedSong.next(selectedSong);
  }

}
