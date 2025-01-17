import ansiEscapes from "ansi-escapes";

export interface Position {
  x: number;
  y: number;
}

export abstract class BaseUI {
  private readonly stdout: NodeJS.WriteStream = process.stdout;
  protected print(text: string) {
    process.stdout.write.bind(process.stdout)(text);
  }
  protected setCursorAt({ x, y }: Position) {
    this.print(ansiEscapes.cursorTo(x, y));
  }
  protected printAt(message: string, position: Position) {
    this.setCursorAt(position);
    this.print(message);
  }
  protected clearLine(row: number) {
    this.printAt(ansiEscapes.eraseLine, { x: 0, y: row });
  }
  // 当前命令行可以显示行数与每行的文本个数
  get terminalSize(): { columns: number; rows: number } {
    return {
      columns: this.stdout.columns,
      rows: this.stdout.rows,
    };
  }
  abstract render(): void;
}
