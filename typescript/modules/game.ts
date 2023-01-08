import { Side, Location, byString, Piece } from "./types4game";
import { createBoard } from "./createBoard";
import { showPiecesFN } from "./showPieces";
import { waitUntil } from "./waitUntil";
import { ml } from "./movableLocations";
import { PieceStruct } from "./pieceStruct";
import { classic, tenXten } from "./boards";

export class Game {
  public board: PieceStruct[] = [];

  constructor(public bs: number) {
    this.board = bs === 10 ? tenXten() : classic();
    createBoard(bs);
    
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
    if (fnToRun.name.indexOf("Pawn") !== -1) {
      if (me.side === Side.White) {
        fnToRun = ml.wPawn;
      } else {
        fnToRun = ml.bPawn;
      }
    }
    return fnToRun(me, this.board, this.bs) ?? [];
  }
}