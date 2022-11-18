import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.css']
})
export class SongItemComponent implements OnInit {
  @Input() songData;
  constructor(private songService: SongService) { }



  ngOnInit(): void {
  }

  getValue(songData){
    console.log(songData);
    this.songService.passSelectedSong(songData)
  }

}
