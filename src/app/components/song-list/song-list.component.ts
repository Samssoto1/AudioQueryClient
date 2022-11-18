import { Component,  OnInit} from '@angular/core';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  canSelect: boolean;
  songData$;
  term: string;
  activeSong;
  songList
  formSelect;

  
  constructor(private songService: SongService) {
  }

  search(value: string){
    this.term = value;
  }

  getSelectedSong(selectedSong){
    console.log(selectedSong);
    this.songService.passSelectedSong(selectedSong);
  }

  ngOnInit(): void {
    this.songData$ = this.songService.songList
}
}
