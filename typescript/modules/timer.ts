import { Side } from "./types4game";
import { wTimer, bTimer } from "./dom";

export class Timer {
  white!: number;
  black!: number;

  wTimer!: number;
  bTimer!: number;

  plus!: number;
  originalSecond!: number;

  constructor({second, plus} : {second: number, plus: number}) {
    this.white = this.black = this.originalSecond = second;
    this.plus = plus;
  }


  start(turn: Side) {
    if (turn === Side.White) {
      this.wTimer = setInterval(() => {
        this.white--;
      }, 1000);
    } else {
      this.bTimer = setInterval(() => {
        this.black--;
      }, 1000);
    }
  }

  stop(turn: Side) {
    if (turn === Side.White) {  
      clearInterval(this.wTimer);

      if (this.white + this.plus <= this.originalSecond) {
        this.white += this.plus;
      } else {
        this.white = this.originalSecond;
      }
    } else {
      clearInterval(this.bTimer);

      if (this.black + this.plus <= this.originalSecond) {
        this.black += this.plus;
      } else {
        this.black = this.originalSecond;
      }
    }
  }

  startCountDown() {
    setInterval(() => {
      wTimer.textContent = toMin(this.white);
      bTimer.textContent = toMin(this.black);
  
      wTimer.style.color = this.white / 60 <= 1 ? "red" : "white";
      bTimer.style.color = this.black / 60 <= 1 ? "red" : "white";
    }, 200);
  }

  clear() {
    clearInterval(this.wTimer);
    clearInterval(this.bTimer);
  }
}

export function toMin(second: number) {
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}