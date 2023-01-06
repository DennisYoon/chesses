import { Game } from "./modules/game";
import { Mode, Side, Location, byString } from "./modules/types4game";

import { checkURL } from "./modules/urlChecker";
import { applyFullscreen } from "./modules/fullscreen";

import { initBoard } from "./modules/showPieces";
import { PieceStruct } from "./modules/pieceStruct";


applyFullscreen();

const body = document.querySelector("body");
const o = document.querySelector("#o");
const x = document.querySelector("#x");

const whiteSide = document.querySelector("#whiteSide");
const blackSide = document.querySelector("#blackSide");

if (checkURL(window.location.href) === Mode.null) {
  body?.classList.add("impossibleURL");
  o?.classList.add("hideEle");
} else {
  body?.classList.add("possibleURL");
  x?.classList.add("hideEle");
  playGame();
}

async function playGame() {
  const BOARDSIZE = 8;
  let TURN = Side.White;
  const g = new Game(BOARDSIZE);

  let mls: Location[] = [];
  let presentLocation: Location = { vert: -1, hori: -1 };
  g.showPieces([]);

  while (true) {
    switch (TURN as Side) {
      case Side.White:
        blackSide?.classList.add("opacityDown");
        break;
      case Side.Black:
        whiteSide?.classList.add("opacityDown");
        break;
    }

    const chosenLoc = await g.willMoveListener(TURN, mls);
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