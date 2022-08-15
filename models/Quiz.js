export class Quiz {
    constructor(questions) {
        this.questions = questions
        this.score = 0
        this.questionIndex = 0
    }

    getCurrentQuestion() {
        return this.questions[this.questionIndex]
    }

    // validateAndContinue(answer) {
        addScoreAndContinue(choice){
    //     if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
            //this.score++
    //     }
            this.score+=this.getCurrentQuestion().howManyPoints(choice);
            this.questionIndex++;
    }

    isEnded() {
        //go to hell
        //gallina tiene huevos
        return this.questions.length === this.questionIndex
    }

}