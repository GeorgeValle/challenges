export class Question {
    constructor(text, choices/*, answer*/) {
        this.text = text
        this.choices = choices
        // this.answer = answer
    }

    // isCorrectAnswer(choice) {
        howManyPoints(choice){
        return this.choices.indexOf(choice)+1;
    //     return choice === this.answer
    }
}