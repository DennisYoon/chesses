import { Game } from "./modules/game";
import { Mode, Side } from "./modules/types4game";

import { checkURL } from "./modules/urlChecker";
import { applyFullscreen } from "./modules/fullscreen";


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
  const TURN = Side.White;
  const g = new Game(BOARDSIZE);

  let mls;
  while (true) {
    g.showPieces([]);
    if (TURN === Side.White) {
      blackSide?.classList.add("opacityDown");
    } else {
      whiteSide?.classList.add("opacityDown");
    }

    const chosenIndex = await g.willMoveListener(TURN);
    mls = g.movableLocationsOf(chosenIndex);
    g.showPieces(mls);
  }
}