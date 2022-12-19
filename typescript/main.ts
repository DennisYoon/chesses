import { Board } from "./modules/setBoard";
import { showBoard } from "./modules/showBoard";
import { createBoard } from "./modules/createBoard";
import { Sides, Location } from "./modules/types4Board";

interface Situation {
  turn: Sides;
  initLocation: Location;
  finalLocation: Location;
}

class Game {
  turn = Sides.White; // 백돌이 선공
  situation: Situation[] = [];
  readonly b = new Board;

  constructor() {
    createBoard();
    showBoard(this.b);
    this.b.activateAllListener();
  }

  changeTurn() {
    this.turn = this.turn === Sides.White ? Sides.Black : Sides.White;
    showBoard(this.b);
  }

  addSituation(situationToAdd: Situation) {
    this.situation.push(situationToAdd);
  }
}

const g = new Game;