import { Question } from "./question.model";

export class dashInfo{
    constructor(
        public quizId: string,
        public questionData: Array<Question>
        ){

    }
}