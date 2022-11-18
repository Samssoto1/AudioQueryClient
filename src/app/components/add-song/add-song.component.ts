import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {
  @ViewChild('f') songUploadForm: NgForm;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  onAddSong(){
    if(this.songUploadForm.valid){
      console.log(this.songUploadForm) // configure this form correctly later
      this.httpService.post("adminSongUpload", {title: this.songUploadForm.value.songInput}).subscribe( (data) => {

      })
    }
}

}
