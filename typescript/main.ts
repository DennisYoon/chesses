import { createBoard } from "./modules/createBoard";
import { Game } from "./modules/game";
import { showPieces } from "./modules/showPieces";

createBoard(8);
const g = new Game(8);
showPieces(g.board, 8);


// import { showBoard } from "./modules/showPieces";
// import { createBoard } from "./modules/createBoard";
// import { Sides, Situation } from "./modules/types4game";

// interface GameConstructor {
//   boardSize?: number;
// }

// class Game {
//   turn = Sides.White; // 백돌이 선공
//   situation: Situation[] = [];
//   b: Board;

//   private boardSize: number;

//   constructor({boardSize = 8}: GameConstructor) {
//     this.boardSize = boardSize >= 8 ? boardSize : 8;

//     createBoard(this.boardSize);

//     this.b = new Board(this.boardSize);
//     showBoard(this.b, this.boardSize);
//     this.b.activateListenersOf(this.turn);
//   }

//   changeTurn() {
//     this.turn = this.turn === Sides.White ? Sides.Black : Sides.White;
//     showBoard(this.b, this.boardSize);
//   }

//   addSituation(situationToAdd: Situation) {
//     this.situation.push(situationToAdd);
//   }
// }

// async function main() {
//   const g = new Game({
//     boardSize: 8
//   });

//   while (true) {
//     console.log(g.turn);
//     let clickedThingIdx = await g.b.clickedPiece();
//     console.log(clickedThingIdx);
//     break;
//   }
// }

// main();