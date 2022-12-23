import { Side, Location, byString } from "./types4game";
import { p /* Piece */ } from "./pieceWizard";

export class Game {
  board = [
    p("w", "k", 8, 5),
    p("w", "q", 8, 4),
    p("w", "b", 8, 3),
    p("w", "b", 8, 6),
    p("w", "n", 8, 2),
    p("w", "n", 8, 7),
    p("w", "r", 8, 1),
    p("w", "r", 8, 8),
    
    p("b", "k", 1, 5),
    p("b", "q", 1, 4),
    p("b", "b", 1, 3),
    p("b", "b", 1, 6),
    p("b", "n", 1, 2),
    p("b", "n", 1, 7),
    p("b", "r", 1, 1),
    p("b", "r", 1, 8)
  ];

  clicked = false;
  clickedThingIdx = 0; 

  constructor(public boardSize: number) {
    for (let hori = 1; hori <= 8; hori++) {
      this.board.push(p("w", "p", 7, hori));
      this.board.push(p("b", "p", 2, hori));
    }
  }

  getPieceIndexByLocation(location: Location) {
    let index = 0;
    for (let piece of this.board) {
      if (
        piece.vert === location.vert
        &&
        piece.hori === location.hori
      ) {
        return index;
      }
      index++;
    }
    return -1;
  } 

  activateListenersOf(side: Side) {
    for (let vert = 1; vert <= this.boardSize; vert++) {
      for (let hori = 1; hori <= this.boardSize; hori++) {
        const foo = this.getPieceIndexByLocation({vert, hori});
        if (foo === -1) {
          const myID = byString({vert, hori});
          document.getElementById(myID)?.addEventListener("click", () => {
            console.log("NULL Piece pressed", myID);
          });
        } else {
          const me = this.board[foo];
          if (me.side === side) {
            me.activateListener(this.board, (loc: Location) => {
              this.clicked = true;
              this.clickedThingIdx = this.getPieceIndexByLocation(loc);
            });
          }
        }
      }
    }
  }

  async clickedPiece() {
    this.clicked = false;
    
    setInterval(() => {
      console.log("hello");
      if (this.clicked) {
        this.clicked = false;
        console.log("what");
        return this.clickedThingIdx;
      }
    }, 200);
  }
}

