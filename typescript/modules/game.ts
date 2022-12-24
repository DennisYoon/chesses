import { Side, Location, byString, Piece } from "./types4game";
import { p /* Piece */ } from "./pieceWizard";
import { createBoard } from "./createBoard";
import { showPiecesFN } from "./showPieces";
import { waitUntil } from "./waitUntil";
import { ml } from "./movableLocations";
import { PieceStruct } from "./pieceStruct";

export class Game {
  board = [
    p("w", "k", 8, 5),
    p("w", "q", 8, 4),
    p("w", "b", 8, 3),
    p("w", "b", 8, 6),
    p("w", "n", 5, 2),
    p("w", "n", 8, 7),
    p("w", "r", 4, 4),
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
    this.board[16] = new PieceStruct(Side.White, Piece.Pawn, {vert: 5, hori: 5});
  }

  showPieces(possibleLocations: Location[] = []) {
    showPiecesFN(this.board, this.bs, possibleLocations);
  }

  async willMoveListener(side: Side) {
    let willMovePieceIdx = -1;

    function thisListener(pieceIDX: number) {
      return () => {
        willMovePieceIdx = pieceIDX;
      }
    }

    this.board.forEach((piece, pieceIDX) => {
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
        me?.addEventListener("click", thisListener(pieceIDX));
      }
    });
    
    await waitUntil(() => willMovePieceIdx !== -1);

    this.board.forEach((piece, pieceIDX) => {
      const me = document.getElementById(byString(piece.location));
      me?.classList.remove("choosableBlack", "choosableWhite");
      me?.removeEventListener("click", thisListener(pieceIDX));
    });

    return willMovePieceIdx;
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