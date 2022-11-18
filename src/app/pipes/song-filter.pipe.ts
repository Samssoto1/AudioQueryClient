import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'songFilter'
})
export class SongFilterPipe implements PipeTransform {

  transform(songs, term){
    // Create an empty array
    let filteredArray = []

    if(term && term.length > 0){
    
    // Filter the array if theres a match to the term. (Lowercase to make comparing accurate)
    filteredArray = songs.filter(
      (song) => 
        song.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    return filteredArray.length > 0 ? filteredArray : songs;
  }

}
