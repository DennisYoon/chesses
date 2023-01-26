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
      this.white += this.plus;
    } else {
      clearInterval(this.bTimer);
      this.black += this.plus;

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