import { Game } from "./modules/game";
import { Side, Location, byString, Piece } from "./modules/types4game";
import { applyFullscreen } from "./modules/fullscreen";
import { initBoard } from "./modules/showPieces";
import { PieceStruct } from "./modules/pieceStruct";
import { whiteSide, blackSide } from "./modules/dom";
import { urlAccess } from "./modules/urlAccess";

applyFullscreen();

urlAccess(window.location.href)
  .then(() => {
    playGame();
  });


const BOARDSIZE = 8;
const g = new Game(BOARDSIZE);

let TURN = Side.White;
let mls: Location[] = [];
let presentLocation: Location = { vert: -1, hori: -1 };

async function playGame() {
  g.showPieces([]);

  /* 현재 차례 알려주는 거 */
  while (true) {
    switch (TURN as Side) {
      case Side.White:
        whiteSide?.classList.remove("opacityDown");
        blackSide?.classList.add("opacityDown");
        break;
      case Side.Black:
        blackSide?.classList.remove("opacityDown");
        whiteSide?.classList.add("opacityDown");
        break;
    }

    /* 기물 선택 & 움직임 */
    const { chosenLoc, choosingAction } = await g.willMoveListener(TURN, mls);

    if (choosingAction) {
      const chosenIdx = getIndexWhoseLocationIs(chosenLoc, g.board);
      const chosenEle = g.board[chosenIdx];
  
      mls = g.movableLocationsOf(chosenIdx);

      initBoard(BOARDSIZE);

      if (presentLocation === chosenEle.location) {
        g.showPieces();
        presentLocation = { vert: -1, hori: -1 };
      } else {
        g.showPieces(mls);
        presentLocation = chosenEle.location;
      }
    } else {
      let removeIDX = getIndexWhoseLocationIs(chosenLoc, g.board);
      const presentPiece = g.board[getIndexWhoseLocationIs(presentLocation, g.board)];

      /* 기본적인 움직임 */
      if (removeIDX !== -1 && g.board[removeIDX].side !== TURN) {
        g.board = [
          ...g.board.slice(0, removeIDX),
          ...g.board.slice(removeIDX + 1, g.board.length)
        ];
      }

      /* 앙파상 */
      if (removeIDX === -1 && presentPiece.piece === Piece.Pawn && chosenLoc.hori - presentPiece.hori) {
        removeIDX = getIndexWhoseLocationIs({
          vert: chosenLoc.vert - (presentPiece.side * 2 - 1),
          hori: chosenLoc.hori
        }, g.board);

        g.board = [
          ...g.board.slice(0, removeIDX),
          ...g.board.slice(removeIDX + 1, g.board.length)
        ];
      }

      /* Pawn 움직인 적 있는가 (for 2칸 전진) & 전에 2칸 전진했는가 (for 앙파상) */
      if (presentPiece.piece === Piece.Pawn) {
        if (!presentPiece.haveMoved && Math.abs(presentPiece.location.vert - chosenLoc.vert) === 2) {
          presentPiece.twoTimesRightBefore = true;
        }
        presentPiece.haveMoved = true;
      }

      /* 움직이기! */
      presentPiece.location = chosenLoc;

      /* 초기화 */
      initBoard(BOARDSIZE);
      mls = [];
      presentLocation = { vert: -1, hori: -1 };

      g.showPieces();

      TURN = TURN as Side === Side.White ? Side.Black : Side.White;

      for (let piece of g.board) {
        if (piece.side === TURN && piece.piece === Piece.Pawn) {
          piece.twoTimesRightBefore = false;
        }
      }
    }
  }
}

function getIndexWhoseLocationIs(location: Location, board: PieceStruct[]) {
  let index: number = -1;
  board.forEach((piece, i) => {
    if (byString(piece.location) === byString(location)) {
      index = i;
      return;
    }
  });
  return index;
}