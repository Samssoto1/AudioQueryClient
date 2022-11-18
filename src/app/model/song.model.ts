export class Song{
    constructor(
        public songTitle: string,
        public audioFile: string,
        public artist: string,
        public audioImg: string = ""
        ){

    }
}