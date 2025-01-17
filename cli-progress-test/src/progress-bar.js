import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
import { EOL } from "os";
import https from "https";
import fs from "fs";
const write = process.stdout.write.bind(process.stdout);
// 实现 ProgressBar
export class ProgressBar {
    constructor() {
        this.total = 0;
        this.value = 0;
    }
    start(total, initVlaue) {
        this.total = total;
        this.value = initVlaue;
        write(ansiEscapes.cursorHide);
        write(ansiEscapes.cursorSavePosition);
        this.render();
    }
    render() {
        let progress = this.value / this.total;
        if (progress < 0) {
            progress = 0;
        }
        else if (progress > 1) {
            progress = 1;
            this.value = this.total;
        }
        const barSize = 40;
        const completeSize = Math.floor(progress * barSize);
        const incompleteSize = barSize - completeSize;
        write(ansiEscapes.cursorRestorePosition);
        write(chalk.blue("█".repeat(completeSize)));
        write("░".repeat(incompleteSize));
        write(` ${this.value} / ${this.total}`);
    }
    update(value) {
        this.value = value;
        this.render();
    }
    getTotalSize() {
        return this.total;
    }
    stop() {
        write(ansiEscapes.cursorShow);
        write(EOL);
    }
}
// 应用
const bar = new ProgressBar();
// bar.start(200, 0);
// let value = 0;
// const timer = setInterval(function () {
//   value++;
//   bar.update(value);
//   if (value > bar.getTotalSize()) {
//     clearTimeout(timer);
//     bar.stop();
//   }
// }, 20);
// 应用下载文件
const downloadURLs = {
    linux: "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/970501/chrome-linux.zip",
    darwin: "https://storage.googleapis.com/chromium-browser-snapshots/Mac/970501/chrome-mac.zip",
    win32: "https://storage.googleapis.com/chromium-browser-snapshots/Win/970501/chrome-win32.zip",
    win64: "https://storage.googleapis.com/chromium-browser-snapshots/Win_x64/970501/chrome-win32.zip",
};
https.get(downloadURLs.darwin, (response) => {
    const file = fs.createWriteStream("./chromium.zip");
    response.pipe(file);
    const totalBytes = parseInt(response.headers["content-length"], 10);
    console.log(response.headers["content-length"], totalBytes);
    let value = 0;
    bar.start(totalBytes, 0);
    response.on("data", function (chunk) {
        value += chunk.length;
        bar.update(value);
        if (value > bar.getTotalSize()) {
            bar.stop();
        }
    });
});
