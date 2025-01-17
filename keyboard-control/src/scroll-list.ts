import { BaseUI } from "./base-ui.js";
import ansiEscapes from "ansi-escapes";

import chalk from "chalk";

export class ScrollList extends BaseUI {
  currentSelectedIndex = 0; // 选择即高亮的行
  scrolledTopCount = 0; // 已滑动多少行
  constructor(private list: Array<string> = []) {
    super();
    process.stdout.write(ansiEscapes.cursorHide);
    this.render(); // 相对于页面每一帧要显示的内容，共两个时机：初始化、up/down 事件
  }

  onKeyInput(name: string) {
    if (name !== "up" && name !== "down") {
      // 只对 up、down 事件做处理
      return;
    }
    this.cursorAction[name]();
    this.render();
  }

  private readonly cursorAction = {
    up: () => this.cursorUp(),
    down: () => this.cursorDown(),
  };

  cursorUp() {
    this.moveCursor(-1);
  }

  cursorDown() {
    this.moveCursor(1);
  }

  private moveCursor(index: number): void {
    this.currentSelectedIndex += index;

    if (this.currentSelectedIndex < 0) {
      this.currentSelectedIndex = 0;
    }

    if (this.currentSelectedIndex >= this.list.length) {
      this.currentSelectedIndex = this.list.length - 1;
    }

    this.fitScroll();
  }

  // 处理是否需要更新 scrolledTopCount，即是否到达上下边界
  fitScroll() {
    const shouldScrollUp = this.currentSelectedIndex < this.scrolledTopCount;

    const shouldScrollDown =
      this.currentSelectedIndex >
      this.scrolledTopCount + this.terminalSize.rows - 2;

    if (shouldScrollUp) {
      this.scrolledTopCount -= 1;
    }

    if (shouldScrollDown) {
      this.scrolledTopCount += 1;
    }

    this.clear();
  }

  // 清理所有行信息
  clear() {
    for (let row = 0; row < this.terminalSize.rows; row++) {
      this.clearLine(row);
    }
  }

  // 高亮当前行
  bgRow(text: string) {
    return chalk.bgBlue(
      text + " ".repeat(this.terminalSize.columns - text.length)
    );
  }

  // 1、确定要显示的列表 2、清除旧有数据
  render() {
    const visibleList = this.list.slice(
      this.scrolledTopCount,
      this.scrolledTopCount + this.terminalSize.rows
    );

    visibleList.forEach((item: string, index: number) => {
      const row = index;

      this.clearLine(row);

      let content = item;

      // 高亮选择的行
      if (this.currentSelectedIndex === this.scrolledTopCount + index) {
        content = this.bgRow(content);
      }
      // 打印每行要显示的文本
      this.printAt(content, {
        x: 0,
        y: row,
      });
    });
  }
}
