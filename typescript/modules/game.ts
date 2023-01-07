import { Side, Location, byString, Piece } from "./types4game";
import { p /* Piece */ } from "./pieceWizard";
import { createBoard } from "./createBoard";
import { showPiecesFN } from "./showPieces";
import { waitUntil } from "./waitUntil";
import { ml } from "./movableLocations";

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

  constructor(public bs: number) {
    createBoard(bs);
    for (let hori = 1; hori <= 8; hori++) {
      this.board.push(p("w", "p", 7, hori));
      this.board.push(p("b", "p", 2, hori));
    }
  }

  showPieces(possibleLocations: Location[] = []) {
    showPiecesFN(this.board, this.bs, possibleLocations);
  }

  async willMoveListener(side: Side, movableLocations: Location[] = []) {
    let willMoveLocation = { vert: -1, hori: -1 };
    let choosingAction = false;

    function listener1(location: Location) {
      return () => {
        willMoveLocation = location;
      }
    }

    function listener2(location: Location) {
      return () => {
        willMoveLocation = location;
        choosingAction = true;
      }
    }

    this.board.forEach(piece => {
      if (piece.side === side) {
        const me = document.getElementById(byString(piece.location))!;
        me?.classList.add(
          ["choosableWhite", "choosableBlack"]
          [
            Array.from(me.id)
              .map(v => parseInt(v))
              .reduce((a, b) => a + b, 0) % 2
          ]
        );
        me?.addEventListener("click", listener2(piece.location));
      }
    });

    for (let movableLocation of movableLocations) {
      const me = document.getElementById(byString(movableLocation));
      me?.classList.add(
        ["choosableWhite", "choosableBlack"]
        [
          Array.from(me.id)
            .map(v => parseInt(v))
            .reduce((a, b) => a + b, 0) % 2
        ]
      );
      me?.addEventListener("click", listener1(movableLocation));
    }
    
    await waitUntil(() => willMoveLocation.hori !== -1);

    this.board.forEach(piece => {
      const me = document.getElementById(byString(piece.location));
      me?.classList.remove("choosableBlack", "choosableWhite");
      me?.removeEventListener("click", listener2(piece.location));
    });

    for (let movableLocation of movableLocations) {
      const me = document.getElementById(byString(movableLocation));
      me?.classList.remove("choosableBlack", "choosableWhite");
      me?.removeEventListener("click", listener1(movableLocation));
    }

    return { chosenLoc: willMoveLocation, choosingAction };
  }

  movableLocationsOf(pieceIndex: number) {
    const me = this.board[pieceIndex];

    let fnToRun = Object.values(ml)[me.piece];
    if (fnToRun.name === "wPawn") {
      if (me.side === Side.White) {
        fnToRun = ml.wPawn;
      } else {
        fnToRun = ml.bPawn;
      }
    }

    return fnToRun(me, this.board, this.bs) ?? [];
  }
}