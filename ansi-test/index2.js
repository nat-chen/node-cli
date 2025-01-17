import readline from "readline";

const repeatCount = process.stdout.rows - 2;
const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
console.log(repeatCount, blank, JSON.stringify(blank));

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);
