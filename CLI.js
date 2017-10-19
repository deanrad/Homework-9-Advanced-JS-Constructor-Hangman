var inquirer = require("inquirer");
var colors = require("colors");
var Superhero = require("./game.js");

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

function newGame () {

	readyPrompt = {
		type: "list",
		message: "Ready?".yellow,
		choices: ["Yes!", "No"],
		name: "ready"
	};

	inquirer.prompt(readyPrompt).then(response => {

		if(response.ready === "Yes!") {
			var game = new Superhero();
		} else {
			return;
		};

		if(game) { // FOR DEBUGGING
			// console.log(game);
			console.log(game.targetWord);
		}; // FOR DEBUGGING

		console.log(`\n  ${game.displayWord}\n`);
		
		function guessLoop () {

			function guessALetter() {
				var guessALetterPrompt = {
					type: "input",
					message: "Guess a letter!".input,
					name: "guessedLetter"
				};

				return inquirer.prompt(guessALetterPrompt)
			};

			var guessAllLetters = Promise.resolve();

			if (game.gameOver === false) {

				guessAllLetters = guessAllLetters
				.then(guessALetter)
				.then(response => game.evaluateLetter(response.guessedLetter.toUpperCase()))
				.then(() => console.log(`\nIncorrect Guesses: ${game.displayIncorrectGuesses}`))
				.then(() => console.log(`Lives Remaining: ${game.livesRemaining}`))
				.then(() => console.log(`\n  ${game.displayWord}\n`))
				.then(() => game.evaluateGameState())
				.then(() => guessLoop())
			} else {
				var playAgainPrompt = {
					type: "list",
					message: "Play again?",
					choices: ["Yes!", "No"],
					name: "ready"
				};

				inquirer.prompt(playAgainPrompt).then(response => {
					if(response.ready === "Yes!") {
						newGame();
					} else {
						return;
					};
				});
			};
		}; // guessLoop(){}

		guessLoop();

	}); // inquirer.gameTypePrompt()
}; // newGame(){}

console.log("Welcome to Hangman!".silly.bold);
newGame();