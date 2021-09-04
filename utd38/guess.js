const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let guessLowerBound = 0;
let guessUpperBound = 1000;

process.stdout.write("500\n", () => rl.once('line', handler));

const handler = (line) => {
    let attempt = Math.round(((guessUpperBound - guessLowerBound) / 2) + guessLowerBound);
    if (line.trim() === "correct") {
        return process.exit(0);
    }

    if (line.trim() === "lower") {
        guessUpperBound = attempt;
    } else if (line.trim() === "higher") {
        guessLowerBound = attempt;
    }
    attempt = Math.round(((guessUpperBound - guessLowerBound) / 2) + guessLowerBound);
    process.stdout.write(attempt + "\n", () => {
        rl.once('line', handler);
    });
};
