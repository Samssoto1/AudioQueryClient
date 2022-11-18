import { Component, OnInit} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import {MatDialog} from '@angular/material/dialog';
import { SongListComponent } from '../song-list/song-list.component';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-show-songs-button',
  templateUrl: './show-songs-button.component.html',
  styleUrls: ['./show-songs-button.component.css']
})
export class ShowSongsButtonComponent implements OnInit {
  list_of_songs;
  selectedSongData;
  
  constructor(private httpService: HttpService, public dialog: MatDialog, private songService: SongService) {}

  ngOnInit(): void {
  }

  getSongList(){
    let dialogRef = this.dialog.open(SongListComponent, {data:{list_of_songs: this.list_of_songs}});
    dialogRef.afterClosed().subscribe(
      result => {
        this.selectedSongData = result;
        console.log(this.selectedSongData)
        // this.songService.passSelectedSong(this.selectedSongData)
      }
      )
    }
}
