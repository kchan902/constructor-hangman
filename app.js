var inquirer = require('inquirer');

var wordBank = ["leopard", "alligator", "flower", "power", "hipster"];

// var answer = wordBank[Math.floor(Math.random() * (wordBank.length - 1)];


function Question() {
	var context = this;
	this.answer = new Word(getRandomWord(wordBank));
	this.count = 10;
	this.name = "bogus_name_FIXME";
	this.type = "input";
	this.message = getMessage();

	function getRandomWord(wordBank) {
		return wordBank[Math.floor(Math.random() * (wordBank.length - 1))];
	}

	Question.prototype.validate = function validate(input) {
		if (!input || input.trim().length > 1) {
			return false;
		}
		let matchingGuess = context.answer.guess(input);
		if (!matchingGuess) {
			context.count--;
		}
		context.message = getMessage();
		return true;
	}

	function getMessage() {
		var guessString = context.answer.getGuess();
		return "Status: " + guessString + "\nGuesses Left: " + context.count + "\nMake a guess please. :D";
	}
}

function Word(answer) {
	this.answer = answer;
	this.currentGuess = [];

	for (var idx = 0; idx < answer.length; idx++) {
		var char = answer[idx];
		this.currentGuess.push(new Letter(char));
	}
}

Word.prototype.guess = function guess(char) {
	let foundMatch = false;
	for (var idx = 0; idx < this.currentGuess.length; idx++) {
		if (this.currentGuess[idx].matches(char)) {
			this.currentGuess[idx].reveal();
			foundMatch = true;
		}
	}
	return foundMatch;
};

Word.prototype.getGuess = function getGuess() {
	var word = "";
	for (var idx = 0; idx < this.currentGuess.length; idx++) {
		word = word + this.currentGuess[idx].getLetter();
	}
	return word;
}

function Letter(char) {
	this.char = char;
	this.isRevealed = false; 
}

Letter.prototype.reveal = function() {
	this.isRevealed = true;
}

Letter.prototype.matches = function(char) {
	return this.char === char;
}

Letter.prototype.getLetter = function() {
	if (this.isRevealed) {
		return this.char;
	} else {
		return "_";
	}
}

let question = new Question();

function askUserQuestion() {
	inquirer.prompt([question]).then(function callback(answer) {
		if (question.count > 0) {
			askUserQuestion();	
		}
	});
}

askUserQuestion();



